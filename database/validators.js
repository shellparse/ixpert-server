
const validateUser = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['username', 'name', 'password'],
      properties: {
        username: {
          bsonType: 'string'
        },
        name: {
          bsonType: 'string'
        },
        password: {
          bsonType: 'string'
        }
      }
    }
  }
}

module.exports = {
  validateUser
}
