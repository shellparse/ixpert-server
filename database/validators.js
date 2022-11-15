
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
          required: ['frontCamera', 'backCamera', 'backGlass', 'frontGlass', 'lcd', 'network', 'chargingPort', 'battery', 'wirelessCharging', 'fingerPrint', 'faceId', 'microphone', 'speaker', 'screws'],
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
            },
            speaker: {
              bsonType: 'bool'
            },
            microphone: {
              bsonType: 'bool'
            },
            screws: {
              bsonType: 'bool'
            },
            notes: {
              bsonType: 'string'
            }
          }
        },
        brand: {
          bsonType: 'string'
        },
        model: {
          bsonType: 'string'
        },
        color: {
          bsonType: 'string'
        },
        neededRepairs: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            additionalProperties: false,
            properties: {
              repair: {
                bsonType: 'string'
              },
              price: {
                bsonType: 'number'
              }
            }
          }
        },
        repairStatus: {
          bsonType: 'bool'
        },
        total: {
          bsonType: 'number'
        },
        cashier: {
          bsonType: 'string'
        },
        returned: {
          bsonType: 'bool'
        },
        passCode: {
          bsonType: 'string'
        }
      }
    }
  }
}
const validateInventory = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['sku', 'price', 'name', 'quantity'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        name: {
          bsonType: 'string'
        },
        sku: {
          bsonType: 'string'
        },
        price: {
          bsonType: 'number'
        },
        quantity: {
          bsonType: 'int'
        },
        category: {
          bsonType: 'string'
        },
        description: {
          bsonType: 'string'
        },
        image: {
          bsonType: 'string'
        },
        brand: {
          bsonType: 'string'
        },
        model: {
          bsonType: 'string'
        },
        imei: {
          bsonType: 'string'
        },
        ram: {
          bsonType: 'string'
        },
        storage: {
          bsonType: 'string'
        },
        color: {
          bsonType: 'string'
        },
        lastUpdated: {
          bsonType: 'date'
        }
      }
    }
  }
}
const validateSalesInvoice = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['customerId', 'number', 'cashier', 'items'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        customerId: {
          bsonType: 'objectId'
        },
        number: {
          bsonType: 'string'
        },
        cashier: {
          bsonType: 'string'
        },
        paymentMethod: {
          bsonType: 'string'
        },
        items: {
          bsonType: 'array',
          minItems: 1,
          items: {
            bsonType: 'object',
            required: ['sku', 'name', 'price', 'amount'],
            properties: {
              _id: {
                bsonType: 'objectId'
              },
              sku: {
                bsonType: 'string'
              },
              name: {
                bsonType: 'string'
              },
              price: {
                bsonType: 'number'
              },
              amount: {
                bsonType: 'number'
              }
            }
          }
        },
        notes: {
          bsonType: 'string'
        },
        paid: {
          bsonType: 'bool'
        },
        total: {
          bsonType: 'number'
        }
      }
    }
  }
}
module.exports = {
  validateUser,
  validateCustomer,
  validateRepairSlip,
  validateInventory,
  validateSalesInvoice
}
