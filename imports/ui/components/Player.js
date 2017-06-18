import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'

let VexTab = window.VexTab
let Artist = window.Artist
let Renderer = window.Vex.Flow.Renderer

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

    let containerId = `measureContainer${index}`
    let componentId = `measure${index}${manipulator._id}`
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
        if (measureId === 0) {
          tabString = tabString + '=|: '
        }
        if (manipulator.patternData) {
          tabString = tabString + manipulator.patternData.pattern
        } else {
          tabString = tabString + ' ## '
        }
        if (measureId === 3) {
          tabString = tabString + ' =:|'
        }
        vextab.parse(tabString)
        artist.render(renderer)
      } catch (e) {
        console.log(e)
      }
    }, 1)

    let style = {}
    if (index === 0) {
      style.zIndex = 1
      style.opacity = 1
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

    return (
      <div key={index} id={containerId} className={'measureContainer'} style={style}>
        <div className={'measureCount'}>
          {measureId + 1}
        </div>
        <div className={'measureContent'} id={componentId}>
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
