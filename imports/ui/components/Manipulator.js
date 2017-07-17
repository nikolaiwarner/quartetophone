import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

export default class Manipulator extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      totalTimeLeft: 60,
      loadingText: 'Connecting to a random player and measure...',
      patternData: {},
      bpm: props.bpm || 85,
      currentMeasureId: 1
    }
    this.onClickClear = this.onClickClear.bind(this)
  }

  componentDidMount () {
    if (this.props.newManipulator) {
      Meteor.call('manipulators.insert', (error, result) => {
        if (error) {
          console.warn('error', result)
          window.location = '/'
          return
        }
        if (result === false) {
          this.setState({
            loadingText: 'All measures are currently filled. Please wait a few moments and try again.'
          })
        } else {
          window.location = '/manipulators/' + result
        }
      })
    }
    window.onbeforeunload = this.expireManipulator.bind(this)
    this.setState({timeLeft: this.state.totalTimeLeft}, () => {
      setInterval(() => {
        this.setState({timeLeft: this.state.timeLeft - 1})
        console.log(this.state.timeLeft)
      }, 1000)
    })

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
          if (currentMeasureId === 1) {
            setTimeout(() => {
              document.getElementById('progress').style.transition = 'all 0ms linear'
              document.getElementById('progress').style.width = '0%'
              document.getElementById('progress').style.opacity = '0'
            }, 1)
            setTimeout(() => {
              document.getElementById('progress').style.transition = `all ${this.millisecondsPerMeasure() - 100}ms linear`
              document.getElementById('progress').style.width = '100%'
              document.getElementById('progress').style.opacity = '1'
            }, 100)
            setTimeout(() => {
              document.getElementById('progress').style.transition = `all 500ms linear`
              document.getElementById('progress').style.opacity = '0'
            }, this.millisecondsPerMeasure())
          }
          this.setState({currentMeasureId})
        }, this.millisecondsPerMeasure())
      }, startDelay)
    })
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

  millisecondsPerMeasure () {
    return ((60 * 1000) / this.state.bpm) * 4
  }

  expireManipulator () {
    Meteor.call('manipulators.expire', this.props.manipulator._id, (error, result) => {
      if (error) { console.warn('error', result) }
    })
  }

  durationOfNote ({x, y}) {
    let duration = 0
    if (this.state.patternData && this.state.patternData[x] && this.state.patternData[x][y]) {
      duration = this.state.patternData[x][y]
    }
    return duration
  }

  onClickClear () {
    this.setState({patternData: {}, timeLeft: this.state.totalTimeLeft}, () => {
      Meteor.call('manipulators.updatePattern', this.props.manipulator._id, this.state.patternData, (error, result) => {
        if (error) { console.warn('error', result) }
      })
    })
  }

  onClickEditorNoteButton ({x, y}) {
    let durations = [0, 1, 2, 4, 8, 16].reverse()
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

    this.setState({patternData, timeLeft: this.state.totalTimeLeft}, () => {
      Meteor.call('manipulators.updatePattern', this.props.manipulator._id, this.state.patternData, (error, result) => {
        if (error) { console.warn('error', result) }
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
        <div className={'measureContentProgress'} id={'progress'} />
      </div>
    )
  }

  render () {
    if (this.props.loading || !this.props.manipulator._id) {
      setTimeout(() => {
        if (this.props.loading || !this.props.manipulator._id) {
          window.location = '/'
        }
      }, 4000)
      return <div className='center'>{this.state.loadingText}</div>
    }
    return (
      <div className='manipulatorContainer'>
        <div className={`header header${this.props.manipulator.playerId}`}>
          <div className={'nav'}>
            <a href={'/'}>Quit</a>
            <a href={'#'} onClick={this.onClickClear}>Clear</a>
          </div>
          <div>
            {(this.state.timeLeft < 10) &&
              <span>
                Timeout in {this.state.timeLeft} seconds
              </span>
            }
          </div>
          <div>
            Player {this.props.manipulator.playerId} .
            Measure {this.props.manipulator.measureId}
          </div>
        </div>
        {this.renderEditor()}
      </div>
    )
  }
}

Manipulator.propTypes = {
  manipulator: PropTypes.object.isRequired
}

Manipulator.contextTypes = {
  router: PropTypes.object
}
