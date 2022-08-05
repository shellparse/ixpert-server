
const validateUser = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['username', 'name', 'password'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
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
const validateCustomer = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['name', 'email', 'phoneNumber'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        name: {
          bsonType: 'string'
        },
        email: {
          bsonType: 'string'
        },
        phoneNumber: {
          bsonType: 'string'
        }
      }
    }
  }
}
module.exports = {
  validateUser,
  validateCustomer
}
