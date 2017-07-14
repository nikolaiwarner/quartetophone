import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'

export default class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      key: props.key || 'C',
      clef: props.clef || 'treble', // treble, alto, tenor, bass, percussion
      bpm: props.bpm || 85,
      beatsPerMeasure: 4,
      currentMeasureId: 1
    }
  }

  componentDidMount () {
    setInterval(() => {
      let currentMeasureId = this.state.currentMeasureId + 1
      if (currentMeasureId === 5) {
        currentMeasureId = 1
      }
      this.setState({currentMeasureId})
    }, this.millisecondsPerMeasure())
  }

  bpmToMilliseconds (bpm) {
    return (60 * 1000) / bpm
  }

  millisecondsPerMeasure () {
    return this.bpmToMilliseconds(this.state.bpm) * this.state.beatsPerMeasure
  }

  durationOfNote ({patternData, x, y}) {
    let duration = 0
    if (patternData && patternData[x] && patternData[x][y]) {
      duration = patternData[x][y]
    }
    return duration
  }

  renderEditorNoteButtonImage ({patternData, x, y}) {
    return <img src={`/images/${this.durationOfNote({patternData, x, y})}.png`} className={'editorNoteButtonImage'} />
  }

  renderMeasure (measureId, index) {
    let manipulator = this.props.manipulators.find((manipulator) => {
      return manipulator.measureId === measureId
    }) || {}
    //
    let containerId = `measureContainer${index}`
    let componentId = `measure${index}${manipulator._id}`
    let componentProgressId = `measure${index}${manipulator._id}_progress`

    let style = {}
    if (index === 0) {
      style.zIndex = 1
      style.opacity = 1

      setTimeout(() => {
        document.getElementById(componentProgressId).style.transition = 'all 0ms linear'
        document.getElementById(componentProgressId).style.width = '0%'
      }, 1)
      setTimeout(() => {
        document.getElementById(componentProgressId).style.transition = `all ${this.millisecondsPerMeasure() - 100}ms linear`
        document.getElementById(componentProgressId).style.width = '100%'
      }, 100)
    } else {
      style.zIndex = 0
      style.opacity = (4 - (index * 1.2)) / 4
      style.transition = `all 0ms linear`
      style.transform = 'none'

      setTimeout(() => {
        document.getElementById(containerId).style.transition = 'all 0ms linear'
        document.getElementById(containerId).style.opacity = (4 - (index + 1 * 1.2)) / 4
        document.getElementById(containerId).style.transform = 'none'
      }, 1)

      setTimeout(() => {
        document.getElementById(containerId).style.transition = `all ${this.millisecondsPerMeasure() - 100}ms linear`
        document.getElementById(containerId).style.opacity = (4 - (index * 1.2)) / 4
        document.getElementById(containerId).style.transform = `translate(0px, -170px)`
      }, 100)
    }

    let patternData = manipulator.patternData
    return (
      <div key={index} id={containerId} className={'measureContainer'} style={style}>
        <div className={'measureCount'}>
          {measureId + 1}
        </div>
        <div className={'editorContainer measureContent'} id={componentId}>
          {[...Array(16)].map((key, x) => {
            return (
              <div key={x} className={'editorColumn'}>
                {[...Array(16)].map((key, y) => {
                  return (
                    <div key={y} className={'editorNoteButton'} >
                      {this.renderEditorNoteButtonImage({patternData, x, y})}
                    </div>
                  )
                })}
              </div>
            )
          })}
          <div className={'measureContentProgress'} id={componentProgressId} />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='playerContainer'>
        <h1>Player {this.props.match.params._id}</h1>
        <div>
          {[0, 1, 2, 3].map((i, index) => {
            let measure = this.state.currentMeasureId + i
            if (measure >= 4) {
              measure = measure - 4
            }
            return this.renderMeasure(measure, index)
          })}
        </div>
      </div>
    )
  }
}

Player.propTypes = {
  manipulators: PropTypes.array.isRequired
}
