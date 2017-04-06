'use strict'

const uuid = require('uuid')

module.exports = class Client  {

  constructor (app, messenger, exchangeName) {
    this.app = app
    this.messenger = messenger
    this.exchangeName = exchangeName
    this.activeTypes = new Map()
  }

  publish (routingKey, data) {
    const taskId = uuid.v1()
    data.taskId = taskId
    return this.messenger.publish(this.exchangeName, routingKey, data)
      .then(() => {
        return taskId
      })
  }

  cancel (typeName, typeId) {
    this.app.log.info('cancelling type', typeName, typeId, this.exchangeName)

    return this.messenger.publish(this.exchangeName, `${typeName}.interrupt`, {
      typeId
    })
  }

}
