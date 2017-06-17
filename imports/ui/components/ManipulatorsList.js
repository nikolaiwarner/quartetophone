import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'

export default class ManipulatorsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div className='container'>
        {this.props.manipulators.map((manipulator) => {
          return (
            <li key={manipulator._id}>
              <a href={'/manipulators/' + manipulator._id}>{manipulator._id}</a>
            </li>
          )
        })}
      </div>
    )
  }
}

ManipulatorsList.propTypes = {
  manipulators: PropTypes.array.isRequired
}
