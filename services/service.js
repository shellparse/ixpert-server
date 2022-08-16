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
let slipNumberCol
// database and validation setup
connect(async (err) => {
  if (!err) {
    shopDb = get().db('shop')
    const collections = await shopDb.listCollections().toArray()
    if (collections.length === 0) {
      userCol = await shopDb.createCollection('user', validateUser)
      userCol.createIndex({ username: 1 }, { unique: true })
      customerCol = await shopDb.createCollection('customer', validateCustomer)
      customerCol.createIndex({ phoneNumber: 1, email: 1 }, { unique: true })
      salesInvoiceCol = await shopDb.createCollection('salesInvoice', validateSalesInvoice)
      inventoryCol = await shopDb.createCollection('inventory', validateInventory)
      barcodeSettingsCol = await shopDb.createCollection('barcodeSettings', validateBarcodeSettings)
      repairSlipCol = await shopDb.createCollection('repairSlip', validateRepairSlip)
      repairSlipCol.createIndex({ slipNumber: 1 }, { unique: true })
      slipNumberCol = await shopDb.createCollection('slipNumber')
    } else if (collections.length === 6) {
      userCol = shopDb.collection('user')
      customerCol = shopDb.collection('customer')
      salesInvoiceCol = shopDb.collection('salesInvoice')
      inventoryCol = shopDb.collection('inventory')
      barcodeSettingsCol = shopDb.collection('barcodeSettings')
      repairSlipCol = shopDb.collection('repairSlip')
      slipNumberCol = shopDb.collection('slipNumber')
    } else {
      throw new Error('something went wrong in database setup')
    }
  }
})

async function createUser (username, name, password) {
  try {
    return await userCol.insertOne({ username, name, password })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getUserById (id) {
  return await userCol.findOne({ _id: ObjectID(id) })
}
async function editUserById (id, username) {
  try {
    return await userCol.findOneAndUpdate({ _id: ObjectID(id) }, { $set: { username } }, { returnDocument: 'after' })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function insertCustomer (name, email, phoneNumber) {
  try {
    return await customerCol.insertOne({ name, email, phoneNumber })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getCustomerByPhone (phoneNumber) {
  try {
    return await customerCol.findOne({ phoneNumber })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getCustomerById (_id) {
  try {
    return await customerCol.findOne({ _id: ObjectID(_id) })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function insertSlip (customerId, slipNumber, imei, checkInStat, brand, model, neededRepairs, total, cashier) {
  try {
    return await repairSlipCol.insertOne({ customerId: ObjectID(customerId), slipNumber, imei, checkInStat, brand, model, neededRepairs, total, cashier })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getSlip (slipNumber) {
  try {
    return await repairSlipCol.findOne({ slipNumber })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function genSlip () {
  try {
    return await slipNumberCol.findOneAndUpdate({}, { $inc: { lastSlip: 1 } }, { returnDocument: 'after', upsert: true })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getCustomers (amount) {
  try {
    return await customerCol.find({}).sort({ _id: -1 }).limit(amount).toArray()
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getSlipNo(){
  try {
    return await slipNumberCol.findOne({})
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
module.exports = {
  createUser,
  getUserById,
  editUserById,
  insertCustomer,
  getCustomerByPhone,
  insertSlip,
  getSlip,
  getCustomerById,
  genSlip,
  getCustomers,
  getSlipNo
}
