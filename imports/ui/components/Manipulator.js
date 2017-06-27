import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

let VexTab = window.VexTab
let Artist = window.Artist
let Renderer = window.Vex.Flow.Renderer

export default class Manipulator extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      patternData: {pattern: ''},
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

  updatePattern (proxy, event) {
    proxy.preventDefault()

    console.log({ x: proxy.screenX, y: proxy.screenY }, {event, proxy})

    let durations = [1, 2, 4, 8, 16, 32]

    let duration = durations[Math.floor(Math.random() * durations.length)]

    let {height, width} = window.getComputedStyle(document.getElementsByClassName('manipulatorContainer')[0])
    height = parseInt(height)
    // console.log(event.screenY, height, event.screenY / height, Math.floor((event.screenY / height) * 16))

    let pitch = Math.floor((1 - (proxy.screenY / height)) * 16) - 2

    let newNote = ` :${duration} ${pitch}/4 `

    this.setState({patternData: {pattern: this.state.patternData.pattern + newNote}}, () => {
      console.log(this.state.patternData)
      Meteor.call('manipulators.updatePattern', this.props.manipulator._id, this.state.patternData, (error, result) => {
        if (error) { console.warn('error', result) }
        console.log('result', result)
      })
    })
  }

  renderEditor () {
    let componentId = 'editor'
    setTimeout(() => {
      let element = document.getElementById(componentId)
      element.innerHTML = ''
      let width = window.getComputedStyle(element).width
      let renderer = new Renderer(document.getElementById(componentId), Renderer.Backends.SVG)
      let artist = new Artist(5, 10, parseInt(width), {scale: 1})
      let vextab = new VexTab(artist)
      try {
        let tabString = `options tab-stems=true tab-stem-direction=up \n ` +
                        `tabstave notation=true tablature=false key=${this.state.key} clef=${this.state.clef} \n ` +
                        `notes `
        tabString = tabString + '=|: '
        if (this.props.manipulator.patternData) {
          tabString = tabString + this.props.manipulator.patternData.pattern
        } else {
          tabString = tabString + ' ## '
        }
        tabString = tabString + ' =:|'
        vextab.parse(tabString)
        artist.render(renderer)
      } catch (e) {
        console.log(e)
      }
    }, 1)
    return (
      <div className={'editorContainer'}>
        <div className={'editor'} id={componentId}>
        </div>
      </div>
    )
  }

  render () {
    if (this.props.loading || !this.props.manipulator._id) {
      return <div className='center'>...</div>
    }
    return (
      <div className='manipulatorContainer' onClick={this.updatePattern.bind(this)}>
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
