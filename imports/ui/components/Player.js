import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'

export default class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bpm: 85,
      beatsPerMeasure: 4,
      currentMeasureId: 1
    }
  }

  componentDidMount () {
    // this.osmd = new window.OSMD('omsd')
    setInterval(() => {
      let currentMeasureId = this.state.currentMeasureId + 1
      if (currentMeasureId === 5) {
        currentMeasureId = 1
      }
      this.setState({currentMeasureId})
    }, this.millisecondsPerMeasure())
  }

  componentDidUpdate () {
    // this.osmd
    //   .load('http://downloads2.makemusic.com/musicxml/MozaVeilSample.xml')
    //   .then(
    //     () => this.osmd.render(),
    //     (err) => console.err(err)
    //   )
    //   .then(
    //     () => console.log('Sheet music displayed.'),
    //     (err) => console.err(err)
    //   )
  }

  bpmToMilliseconds (bpm) {
    return (60 * 1000) / bpm
  }

  millisecondsPerMeasure () {
    return this.bpmToMilliseconds(this.state.bpm) * this.state.beatsPerMeasure
  }

  renderMeasure (measureId, index) {
    let manipulator = this.props.manipulators.find((manipulator) => {
      return manipulator.measureId === measureId
    }) || {}
    return (
      <div key={manipulator._id} className={'measureContainer'} style={{opacity: (4 - index) / 4}}>
        <div className={'measureCount'}>
          {measureId + 1}
        </div>
        <div className={'measureContent'}>
          {!!manipulator.patternData &&
            <span>{manipulator.patternData.pattern.toString()}</span>
          }
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='playerContainer'>
        <h1>Player {this.props.match.params._id}</h1>
        <div id='omsd' />
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
