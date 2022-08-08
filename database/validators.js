
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
const validateRepairSlip = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['customerId', 'imei', 'slipNumber', 'checkInStat', 'brand', 'model', 'neededRepairs', 'total', 'cashier'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        customerId: {
          bsonType: 'objectId'
        },
        imei: {
          bsonType: 'string'
        },
        slipNumber: {
          bsonType: 'string'
        },
        checkInStat: {
          bsonType: 'object',
          additionalProperties: false,
          required: ['frontCamera', 'backCamera', 'backGlass', 'frontGlass', 'lcd', 'network', 'chargingPort', 'battery', 'wirelessCharging', 'fingerPrint', 'faceId'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            frontCamera: {
              bsonType: 'bool'
            },
            backCamera: {
              bsonType: 'bool'
            },
            backGlass: {
              bsonType: 'bool'
            },
            frontGlass: {
              bsonType: 'bool'
            },
            lcd: {
              bsonType: 'bool'
            },
            network: {
              bsonType: 'bool'
            },
            chargingPort: {
              bsonType: 'bool'
            },
            battery: {
              bsonType: 'bool'
            },
            wirelessCharging: {
              bsonType: 'bool'
            },
            fingerPrint: {
              bsonType: 'bool'
            },
            faceId: {
              bsonType: 'bool'
            }
          }
        },
        brand: {
          bsonType: 'string'
        },
        model: {
          bsonType: 'string'
        },
        neededRepairs: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        },
        repairStatus: {
          bsonType: 'bool'
        },
        total: {
          bsonType: 'int'
        },
        cashier: {
          bsonType: 'objectId'
        },
        returned: {
          bsonType: 'bool'
        }
      }
    }
  }
}
module.exports = {
  validateUser,
  validateCustomer,
  validateRepairSlip
}
