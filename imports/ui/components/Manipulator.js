import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

export default class Manipulator extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      patternData: {},
      key: props.key || 'C',
      clef: props.clef || 'treble', // treble, alto, tenor, bass, percussion
      bpm: props.bpm || 85,
      beatsPerMeasure: 4,
      currentMeasureId: 1
    }
  }

  componentDidMount () {
    if (this.props.newManipulator) {
      Meteor.call('manipulators.insert', (error, result) => {
        if (error) { console.warn('error', result) }
        window.location = '/manipulators/' + result
      })
    }
    window.onbeforeunload = this.expireManipulator.bind(this)
  }

  componentWillUnmount () {
    this.expireManipulator()
  }

  componentDidUpdate (prevProps, prevState) {
    if (!this.props.loading) {
      if (prevProps.manipulator) {
        if (prevProps.manipulator._id && !this.props.manipulator._id) {
          window.location = '/'
        }
      }
    }
  }

  expireManipulator () {
    Meteor.call('manipulators.expire', this.props.manipulator._id, (error, result) => {
      if (error) { console.warn('error', result) }
      console.log('result', result)
    })
  }

  durationOfNote ({x, y}) {
    let duration = 0
    if (this.state.patternData && this.state.patternData[x] && this.state.patternData[x][y]) {
      duration = this.state.patternData[x][y]
    }
    return duration
  }

  onClickEditorNoteButton ({x, y}) {
    let durations = [0, 1, 2, 4, 8, 16]
    let durationIndex = durations.indexOf(this.durationOfNote({x, y}))
    durationIndex = durationIndex + 1
    if (durationIndex > durations.length - 1) {
      durationIndex = 0
    }
    let z = durations[durationIndex]
    let patternData = this.state.patternData || {}
    if (!patternData[x]) {
      patternData[x] = {}
    }
    patternData[x][y] = z

    this.setState({patternData}, () => {
      Meteor.call('manipulators.updatePattern', this.props.manipulator._id, this.state.patternData, (error, result) => {
        if (error) { console.warn('error', result) }
        console.log('result', result)
      })
    })
  }

  renderEditorNoteButtonImage ({x, y}) {
    return <img src={`/images/${this.durationOfNote({x, y})}.png`} className={'editorNoteButtonImage'} />
  }

  renderEditor () {
    // x: 16 columns
    // y: 16 notes
    // z: 7 note durations;  multiple taps toggle the length of note
    return (
      <div className={'editorContainer'}>
        {[...Array(16)].map((key, x) => {
          return (
            <div key={x} className={'editorColumn'}>
              {[...Array(16)].map((key, y) => {
                return (
                  <div key={y} className={'editorNoteButton'} onClick={this.onClickEditorNoteButton.bind(this, {x, y})} >
                    {this.renderEditorNoteButtonImage({x, y})}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  render () {
    if (this.props.loading || !this.props.manipulator._id) {
      return <div className='center'>...</div>
    }
    return (
      <div className='manipulatorContainer'>
        {this.renderEditor()}
        Player {this.props.manipulator.playerId} .
        Measure {this.props.manipulator.measureId}
      </div>
    )
  }
}

Manipulator.propTypes = {
  manipulator: PropTypes.object.isRequired
}

Manipulator.contextTypes = {
  router: React.PropTypes.object
}
