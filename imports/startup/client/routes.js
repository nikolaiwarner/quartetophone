import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Index, Admin } from '../../ui/components/index.js'
// import About from '../../ui/components/About.js'
// import Capture from '../../ui/components/Capture.js'
import PlayerContainer from '../../ui/containers/PlayerContainer.js'
import ManipulatorContainer from '../../ui/containers/ManipulatorContainer.js'
import ManipulatorsContainer from '../../ui/containers/ManipulatorsContainer.js'

window.Meteor.startup(() => {
  render(
    <Router>
      <div>
        <Route exact path='/' component={Index} />
        <Route exact path='/admin' component={Admin} />
        <Route exact path='/manipulators/:_id' component={ManipulatorContainer} />
        <Route exact path='/manipulators' component={ManipulatorsContainer} />
        <Route exact path='/players/:_id' component={PlayerContainer} />
      </div>
    </Router>,
    document.getElementById('render-target')
  )
})
