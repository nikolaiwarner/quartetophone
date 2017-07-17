import { Meteor } from 'meteor/meteor'
import { Manipulators } from '../../api/manipulators.js'
import { createContainer } from 'meteor/react-meteor-data'
import Manipulator from '../components/Manipulator'

export default createContainer((params) => {
  const manipulatorsHandle = Meteor.subscribe('manipulatorsActive')
  const loading = !manipulatorsHandle.ready()
  let newManipulator = (params.match.params._id === 'new')
  let manipulator = newManipulator ? {} : (Manipulators.findOne({_id: params.match.params._id}) || {})
  return {
    loading,
    newManipulator,
    manipulator: manipulator
  }
}, Manipulator)
