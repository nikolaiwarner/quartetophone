import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import moment from 'Moment'

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
      'updatedAt': {'$lt': moment().subtract(30, 'seconds').toDate()}
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

    console.log({activeManipulators})

    // const findOpenPlayerAndMeasure = () => {
      const getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      let randomPlayerId = getRandomIntInclusive(1, 4)
      let randomMeasureId = getRandomIntInclusive(1, 4)
      let open = !activeManipulators.some((manipulator) => {
        return manipulator.playerId === randomPlayerId &&
               manipulator.measureId === randomMeasureId
      })
      console.log('trying', {randomPlayerId, randomMeasureId}, activeManipulators, open)

    //   // return
    //   if (open) {
    //     return Manipulators.insert({
    //       playerId: randomPlayerId,
    //       measureId: randomMeasureId,
    //       createdAt: new Date()
    //     })
    //   } else {
    //     // return findOpenPlayerAndMeasure()
    //   }
    // }
    // return findOpenPlayerAndMeasure()

    return Manipulators.insert({
      playerId: randomPlayerId,
      measureId: randomMeasureId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
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
