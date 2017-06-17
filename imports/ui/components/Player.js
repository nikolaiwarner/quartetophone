import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'

export default class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    // this.osmd = new window.OSMD('omsd')
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

  render () {
    // this.props.manipulators
    console.log(this.props.manipulators)
    return (
      <div className='playerContainer'>
        <h1>Player {this.props.match.params._id}</h1>
        <div id='omsd' />
        {this.props.manipulators.sort((a, b) => a.measureId - b.measureId).map((manipulator) => {
          return (
            <li key={manipulator._id}>
              {manipulator.measureId} - {manipulator._id}:
              {!!manipulator.patternData &&
                <span>{manipulator.patternData.pattern.toString()}</span>
              }
            </li>
          )
        })}
      </div>
    )
  }
}

Player.propTypes = {
  manipulators: PropTypes.array.isRequired
}
