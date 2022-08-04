const { ObjectID } = require('bson')
const { connect, get } = require('../database/connection.js')
const { validateUser, validateCustomer, validateInventory, validateBarcodeSettings, validateRepairSlip, validateSalesInvoice } = require('../database/validators.js')

let shopDb
let userCol
let customerCol
let salesInvoiceCol
let inventoryCol
let barcodeSettingsCol
let repairSlipCol
// database and validation setup
connect(async (err) => {
  if (!err) {
    shopDb = get().db('shop')
    const collections = await shopDb.listCollections().toArray()
    if (collections.length === 0) {
      userCol = await shopDb.createCollection('user', validateUser)
      customerCol = await shopDb.createCollection('customer', validateCustomer)
      salesInvoiceCol = await shopDb.createCollection('salesInvoice', validateSalesInvoice)
      inventoryCol = await shopDb.createCollection('inventory', validateInventory)
      barcodeSettingsCol = await shopDb.createCollection('barcodeSettings', validateBarcodeSettings)
      repairSlipCol = await shopDb.createCollection('repairSlip', validateRepairSlip)
    } else if (collections.length === 6) {
      userCol = shopDb.collection('user')
      customerCol = shopDb.collection('customer')
      salesInvoiceCol = shopDb.collection('salesInvoice')
      inventoryCol = shopDb.collection('inventory')
      barcodeSettingsCol = shopDb.collection('barcodeSettings')
      repairSlipCol = shopDb.collection('repairSlip')
    } else {
      throw new Error('something went wrong in database setup')
    }
  }
})

async function createUser (username, name, password) {
  let response
  try {
    response = await userCol.insertOne({ username, name, password })
  } catch (e) {
    response = new Error("could'nt insert user")
  }
  return response
}
async function getUserById (id) {
  return await userCol.findOne({ _id: ObjectID(id) })
}

module.exports = {
  createUser,
  getUserById
}
