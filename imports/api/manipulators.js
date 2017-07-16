import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import moment from 'moment'

export const Manipulators = new Mongo.Collection('manipulators')

if (Meteor.isServer) {
  Meteor.publish('manipulatorsActive', () => {
    return Manipulators.find({'expiredAt': {'$exists': false}})
  })
  Meteor.publish('manipulatorsAll', () => {
    return Manipulators.find()
  })

  const expireManipulators = () => {
    let activeManipulators = Manipulators.find({
      'expiredAt': {'$exists': false},
      'updatedAt': {'$lt': moment().subtract(60, 'seconds').toDate()}
    }).fetch()
    console.log('activeManipulators to remove', activeManipulators.length)
    activeManipulators.forEach((manipulator) => {
      if (manipulator._id) {
        Meteor.call('manipulators.expire', manipulator._id)
      }
    })
  }
  Meteor.setInterval(expireManipulators, 5000)
}

Meteor.methods({
  'manipulators.insert' () {
    let activeManipulators = Manipulators.find({'expiredAt': {'$exists': false}}).fetch()
    let activePairs = activeManipulators.map((manipulator) => {
      return `${manipulator.playerId}:${manipulator.measureId}`
    })
    let availablePairs = [
      '1:1', '1:2', '1:3', '1:4',
      '2:1', '2:2', '2:3', '2:4',
      '3:1', '3:2', '3:3', '3:4',
      '4:1', '4:2', '4:3', '4:4'
    ]
    let remainingPairs = availablePairs.filter((pair) => !activePairs.includes(pair))
    console.log({remainingPairs: remainingPairs.length})
    if (remainingPairs.length > 0) {
      let pair = remainingPairs[Math.floor(Math.random() * remainingPairs.length)]
      let ids = pair.split(':')
      return Manipulators.insert({
        playerId: parseInt(ids[0]),
        measureId: parseInt(ids[1]),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } else {
      return false
    }
  },
  'manipulators.remove' (manipulatorId) {
    check(manipulatorId, String)
    Manipulators.remove(manipulatorId)
  },
  'manipulators.expire' (manipulatorId) {
    if (!manipulatorId) { return }
    check(manipulatorId, String)
    return Manipulators.update(manipulatorId, { $set: { expiredAt: new Date() } })
  },
  'manipulators.updatePattern' (manipulatorId, patternData) {
    check(manipulatorId, String)
    check(patternData, Object)
    return Manipulators.update(manipulatorId, { $set: { patternData, updatedAt: new Date() } })
  }
})
