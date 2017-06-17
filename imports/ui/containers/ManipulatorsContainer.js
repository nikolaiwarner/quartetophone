import { Meteor } from 'meteor/meteor'
import { Manipulators } from '../../api/manipulators.js'
import { createContainer } from 'meteor/react-meteor-data'
import ManipulatorsList from '../components/ManipulatorsList'

export default createContainer(({ params }) => {
  const manipulatorsHandle = Meteor.subscribe('manipulatorsActive')
  const loading = !manipulatorsHandle.ready()
  return {
    loading,
    manipulators: Manipulators.find().fetch()
  }
}, ManipulatorsList)
