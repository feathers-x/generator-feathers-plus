const serviceSpecsToMongoose = require('../../../lib/service-specs-to-mongoose')
const assert = require('assert')
const usersSchema = require('./users.schema')

describe('Creates Mongoose Schemas', function () {
  it('includes enum attributes', function () {
    const mongooseSchema = serviceSpecsToMongoose(usersSchema.schema)

    assert.deepEqual(mongooseSchema.roles.enum, [ 'admin' ], 'enum was correctly applied')
  })
})
