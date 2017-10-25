const shortId = require('shortid')

module.exports = {
  beforeCreate: (values, options) => {
    // TODO make this an actual request id and not just a random generate on create
    values.request = `req_${shortId.generate()}`
    // console.log(values)
  },
  afterCreate: (values, options, fn) => {

  }
}
