import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import Tone from 'tone'
import Fullscreen from 'react-html5-fullscreen'

export default class Players extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bpm: props.bpm || 85,
      currentMeasureId: 1,
      playAudio: true
    }

    let bitcrusher = new Tone.BitCrusher(4).toMaster()
    let vibrato = new Tone.Vibrato().toMaster()
    let freeverb = new Tone.Freeverb().toMaster()
    this.synth = new Tone.PolySynth(2, Tone.Synth).connect(bitcrusher).connect(vibrato).connect(freeverb)
    // this.synth.set('detune', -1200 * this.state.playerId)

    this.onClickPlayAudio = this.onClickPlayAudio.bind(this)
  }

  componentDidMount () {
    // To syncronize clients, calculate measures elapsed since the beginning of time
    let measuresElapsed = Date.now() / this.millisecondsPerMeasure()
    let currentMeasure = (measuresElapsed % 4)
    let percentUntilNextMeasure = (currentMeasure + '').split('.')
    let startDelay = 0
    if (percentUntilNextMeasure[1]) {
      percentUntilNextMeasure = 1 - parseFloat('0.' + percentUntilNextMeasure[1])
      startDelay = percentUntilNextMeasure * this.millisecondsPerMeasure()
    }
    this.setState({currentMeasureId: Math.floor(currentMeasure) + 1}, () => {
      // Delay start until next whole measure
      setTimeout(() => {
        setInterval(() => {
          let currentMeasureId = this.state.currentMeasureId + 1
          if (currentMeasureId === 5) {
            currentMeasureId = 1
          }
          this.setState({currentMeasureId})
        }, this.millisecondsPerMeasure())
      }, startDelay)
    })
  }

  millisecondsPerMeasure () {
    return ((60 * 1000) / this.state.bpm) * 4
  }

  durationOfNote ({patternData, x, y}) {
    let duration = 0
    if (patternData && patternData[x] && patternData[x][y]) {
      duration = patternData[x][y]
    }
    return duration
  }

  onClickPlayAudio () {
    this.setState({playAudio: !this.state.playAudio})
  }

  renderEditorNoteButtonImage ({patternData, x, y, index}) {
    let duration = this.durationOfNote({patternData, x, y})
    if (this.state.playAudio) {
      if (index === 0 && duration !== 0) {
        let note = [
          'c6', 'd6', 'e6', 'f6', 'g6', 'a6', 'b6',
          'c5', 'd5', 'e5', 'f5', 'g5', 'a5', 'b5',
          'c4', 'd4'].reverse()[y]
        let delay = this.millisecondsPerMeasure() * (x / 16)
        setTimeout(() => {
          this.synth.triggerAttackRelease(note, `${duration}n`)
        }, delay)
      }
    }

    return <img src={`/images/${duration}.png`} className={'editorNoteButtonImage'} />
  }

  renderPlayer (playerId) {
    let manipulator = this.props.manipulators.find((manipulator) => {
      return manipulator.measureId === this.state.currentMeasureId &&
             manipulator.playerId === playerId
    }) || {}
    let componentId = `player${playerId}`
    let componentProgressId = `player${playerId}_progress`
    let style = {}
    // if (index === 0) {
      // style.display = 'flex'
      // setTimeout(() => {
      //   document.getElementById(componentProgressId).style.transition = 'all 0ms linear'
      //   document.getElementById(componentProgressId).style.width = '0%'
      // }, 1)
      // setTimeout(() => {
      //   document.getElementById(componentProgressId).style.transition = `all ${this.millisecondsPerMeasure() - 100}ms linear`
      //   document.getElementById(componentProgressId).style.width = '100%'
      // }, 100)
    // } else {
    //   style.display = 'none'
    // }

    let patternData = manipulator.patternData
    return (
      <div id={componentId} className={'editorContainer playerEditorContainer'}>
        {[...Array(16)].map((key, x) => {
          return (
            <div key={x} className={'editorColumn'}>
              {[...Array(16)].map((key, y) => {
                return (
                  <div key={y} className={'editorNoteButton'} >
                    {this.renderEditorNoteButtonImage({patternData, x, y, index: 0})}
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
    return (
      <div className='manipulatorContainer'>
        <div className={`header`}>
          <div>
            <strong>quartetophone</strong> . Measure {this.state.currentMeasureId}
          </div>
          <div>
            <Fullscreen
              contentEnter={<a href={'#'}>Enter fullscreen</a>}
              contentExit={<a href={'#'}>Exit fullscreen</a>}
              target='body'
            />
            <a href={'#'} onClick={this.onClickPlayAudio}>{this.state.playAudio ? 'Turn audio off' : 'Turn audio on'}</a>
          </div>
        </div>
        <div className='players'>
          {this.renderPlayer(1)}
          {this.renderPlayer(2)}
          {this.renderPlayer(3)}
          {this.renderPlayer(4)}
        </div>
      </div>
    )
  }
}

Players.propTypes = {
  manipulators: PropTypes.array.isRequired
}
