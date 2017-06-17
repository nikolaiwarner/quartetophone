import { Meteor } from 'meteor/meteor'
import { Manipulators } from '../../api/manipulators.js'
import { createContainer } from 'meteor/react-meteor-data'
import Player from '../components/Player'

export default createContainer(({match}) => {
  const manipulatorsHandle = Meteor.subscribe('manipulatorsActive')
  const loading = !manipulatorsHandle.ready()
  return {
    loading,
    manipulators: Manipulators.find({playerId: parseInt(match.params._id)}).fetch()
  }
}, Player)
