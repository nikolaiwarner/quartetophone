import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

export default class Manipulator extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      patternData: {pattern: ''}
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

  updatePattern (event, one, two) {
    event.preventDefault()

    console.log({ x: event.screenX, y: event.screenY })

    let durations = [1, 2, 4, 8, 16, 32]

    let duration = durations[Math.floor(Math.random() * durations.length)]


    let {height, width} = window.getComputedStyle(document.getElementsByClassName('manipulatorContainer')[0])
    height = parseInt(height)
    // console.log(event.screenY, height, event.screenY / height, Math.floor((event.screenY / height) * 16))

    let pitch = Math.floor((1 - (event.screenY / height)) * 16) - 2

    let newNote = ` :${duration} ${pitch}/4 `

    this.setState({patternData: {pattern: this.state.patternData.pattern + newNote}}, () => {
      console.log(this.state.patternData)
      Meteor.call('manipulators.updatePattern', this.props.manipulator._id, this.state.patternData, (error, result) => {
        if (error) { console.warn('error', result) }
        console.log('result', result)
      })
    })
  }

  render () {
    if (this.props.loading || !this.props.manipulator._id) {
      return <div>loading</div>
    }
    return (
      <div className='manipulatorContainer' onClick={this.updatePattern.bind(this)}>
        manipulatorId: {this.props.manipulator._id}
        <br />
        playerId: {this.props.manipulator.playerId}
        <br />
        measureId: {this.props.manipulator.measureId}
        {!!this.props.manipulator.createdAt &&
          <div>
            createdAt: {this.props.manipulator.createdAt.toString()}
          </div>
        }
        {!!this.props.manipulator.updatedAt &&
          <div>
            updatedAt: {this.props.manipulator.updatedAt.toString()}
          </div>
        }
        {!!this.props.manipulator.expiredAt &&
          <div>
            expiredAt: {this.props.manipulator.expiredAt.toString()}
          </div>
        }
        {!!this.props.manipulator.expiredAt &&
          <div>
            expiredAt: {this.props.manipulator.expiredAt.toString()}
          </div>
        }
        {!!this.props.manipulator.patternData &&
          <span>{this.props.manipulator.patternData.pattern.toString()}</span>
        }
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
