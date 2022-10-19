const { ObjectID } = require('bson')
const { connect, get } = require('../database/connection.js')
const { validateUser, validateCustomer, validateInventory, validateBarcodeSettings, validateRepairSlip, validateSalesInvoice } = require('../database/validators.js')
const PDFDocument = require('pdfkit')
let shopDb
let userCol
let customerCol
let salesInvoiceCol
let inventoryCol
let barcodeSettingsCol
let repairSlipCol
let slipNumberCol
let invoiceNumberCol
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
      inventoryCol.createIndex({ sku: 1 }, { unique: true })
      barcodeSettingsCol = await shopDb.createCollection('barcodeSettings', validateBarcodeSettings)
      repairSlipCol = await shopDb.createCollection('repairSlip', validateRepairSlip)
      repairSlipCol.createIndex({ slipNumber: 1 }, { unique: true })
      slipNumberCol = await shopDb.createCollection('slipNumber')
      invoiceNumberCol = await shopDb.createCollection('invoiceNumber')
    } else if (collections.length === 8) {
      userCol = shopDb.collection('user')
      customerCol = shopDb.collection('customer')
      salesInvoiceCol = shopDb.collection('salesInvoice')
      inventoryCol = shopDb.collection('inventory')
      barcodeSettingsCol = shopDb.collection('barcodeSettings')
      repairSlipCol = shopDb.collection('repairSlip')
      slipNumberCol = shopDb.collection('slipNumber')
      invoiceNumberCol = shopDb.collection('invoiceNumber')
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
async function insertSlip (customerId, slipNumber, imei, checkInStat, color, brand, model, neededRepairs, total, cashier) {
  try {
    return await repairSlipCol.insertOne({ customerId: ObjectID(customerId), slipNumber, imei, checkInStat, color, brand, model, neededRepairs, total: parseFloat(total), cashier })
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
async function getSlipNo () {
  try {
    return await slipNumberCol.findOne({})
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}

async function insertInv (sku, category, name, description, price, lastUpdated, quantity, image, brand, model, imei, ram, storage, color) {
  try {
    return await inventoryCol.insertOne({ sku, category, name, description, price: parseFloat(price), lastUpdated: new Date(lastUpdated), quantity, image, brand, model, imei, ram, storage, color })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getInvItems (sku) {
  try {
    if (sku) {
      const regEx = new RegExp(`^${sku}`, 'gi')
      return await inventoryCol.find({ sku: { $regex: regEx } }).toArray()
    } else {
      return await inventoryCol.find({ }).toArray()
    }
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function updateInv (_id, updateBody) {
  const date = new Date()
  try {
    return await inventoryCol.findOneAndUpdate({ _id: ObjectID(_id) }, { $set: { ...updateBody, lastUpdated: date } }, { returnDocument: 'after' })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function insertInvoice () {
  try {
    return await salesInvoiceCol.insertOne({ ...arguments })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function getInvoiceNo () {
  try {
    return await invoiceNumberCol.findOne({})
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}
async function genInvoice () {
  try {
    return await invoiceNumberCol.findOneAndUpdate({}, { $inc: { lastInvoice: 1 } }, { returnDocument: 'after', upsert: true })
  } catch (e) {
    console.dir(e, { depth: null })
    return e
  }
}

async function genSlipPdf (data, res) {
  const doc = new PDFDocument({ size: 'A5' })
  doc.pipe(res)
  const logo = 'M53.56,1.4A2.87,2.87,0,0,0,52,4.61a2.78,2.78,0,0,0,3.05,2.21,2.72,2.72,0,0,0,2.23-1.39,2.9,2.9,0,0,0-.86-3.82A3.11,3.11,0,0,0,53.56,1.4ZM34.8,7.16a1,1,0,0,0-.29.59,1.09,1.09,0,0,0,.85.88A.89.89,0,0,0,36,7.17.77.77,0,0,0,34.8,7.16Zm-4,1.68a1.38,1.38,0,0,0,.65,2.59,1.23,1.23,0,0,0,1.33-.78A1.33,1.33,0,0,0,32.42,9,1.31,1.31,0,0,0,30.84,8.84Zm11.66.23a5.27,5.27,0,0,0-2.56,1.31l-.65.62h-3l-3,0-.53.53a1.32,1.32,0,0,1-1.19.52,1.27,1.27,0,0,1-1.17-.52L29.83,11l-5.94,0c-5.9.05-5.94.05-6.72.4A4.9,4.9,0,0,0,14.82,14c-.25.73-.25,2-.22,25.65l.05,24.88.34.75a4.62,4.62,0,0,0,2,2.15l.62.34,10.81.05c12.48,0,11.73.11,13.15-1.3s1.29.05,1.29-19.09V30.71h.53A1.65,1.65,0,0,0,45,29.09a1.28,1.28,0,0,0-.5-1.11c-.47-.48-.56-.5-1.44-.48a2.75,2.75,0,0,1-1.55-.3l-.63-.31V64.24l-.34.5a3.75,3.75,0,0,1-.82.82l-.5.34h-21l-.5-.34a3.36,3.36,0,0,1-.82-.82l-.34-.5V14.56l.34-.5a2.83,2.83,0,0,1,1-.84,4.18,4.18,0,0,1,2.23-.32c1.73,0,1.61-.06,1.82,1a1.34,1.34,0,0,0,.4.74c.28.26.63.28,6.51.23,7-.06,6.56,0,6.9-1.19l.19-.68,1.27,0,1.25,0,.07,1.23a4.75,4.75,0,0,0,4.83,4.69A4.88,4.88,0,0,0,47,10.65,5,5,0,0,0,42.5,9.07ZM32.23,13.19a.54.54,0,0,1-.39.74.44.44,0,0,1-.36-.66A.49.49,0,0,1,32.23,13.19Zm-1.7.3c0,.28-.1.29-1.76.29s-1.77,0-1.77-.29.1-.3,1.77-.3S30.53,13.21,30.53,13.49Zm20.06-4a.78.78,0,0,0,.76,1.24.79.79,0,0,0,.43-1.11A1,1,0,0,0,50.59,9.54Zm6.81.13A1.93,1.93,0,0,0,56,11.53a2,2,0,0,0,3.68,1.07A1.93,1.93,0,0,0,59,9.91,2.06,2.06,0,0,0,57.4,9.67Zm-6,4.33a2.72,2.72,0,0,0-1.78,2.89,2.76,2.76,0,0,0,2.55,2.19,3.51,3.51,0,0,0,1.85-.7,3.47,3.47,0,0,0,.83-1.8,2.77,2.77,0,0,0-2-2.64A1.69,1.69,0,0,0,51.38,14Zm-11,4.57c0,.4.15.45.62.2.31-.16.31-.17-.05-.36S40.4,18.16,40.4,18.57ZM20,19.3c-.16.42.06.61,1.14,1a23.74,23.74,0,0,1,5.1,2.75c.87.69,1.14,1.11,6.11,9.46,2.88,4.78,5.72,9.57,6.34,10.63l1.13,1.91V35.82l-3.56-6c-2-3.28-3.65-6.17-3.76-6.42a2.73,2.73,0,0,1,1.09-3.22c.46-.33.63-.55.61-.77s-.14-.29-7.09-.34C21,19.08,20.07,19.11,20,19.3Zm18.26.8a2.48,2.48,0,0,0-1.5,2.3,2.55,2.55,0,0,0,1.17,2.53,2.48,2.48,0,0,0,1.73.42,6,6,0,0,1,1.38.12.85.85,0,0,0,1.15-1.1,2.16,2.16,0,0,1,0-1.16,2.61,2.61,0,0,0-.66-2.46A2.7,2.7,0,0,0,38.25,20.1ZM51.82,20c-.14.4.06.6,1,1s1.54.85,1.54,1.43c0,.22-1.74,3.25-4.2,7.34l-4.18,7,.82,1.33.83,1.32L52.09,32c4.06-6.76,4.5-7.44,5.24-8a18.66,18.66,0,0,1,4.74-2.73c1.58-.63,1.81-.79,1.65-1.22-.07-.19-.88-.22-5.95-.22S51.9,19.85,51.82,20ZM2.47,29.89A2.62,2.62,0,0,0,1.22,33,2.78,2.78,0,0,0,3,34.54a2.49,2.49,0,0,0,2.61-3.83A2.64,2.64,0,0,0,2.47,29.89Zm77.05,2.55c-.21.2-.08.32.65.57,1.41.52,1.31-.34,1.31,10.5,0,8.13,0,9.57-.23,9.82a2.6,2.6,0,0,1-1,.65c-.45.17-.79.41-.76.5s2.28.17,7.92.2c4.33,0,8,0,8.2,0s.32-.13.32-1.77a5.32,5.32,0,0,0-.13-1.69,2.41,2.41,0,0,0-.54.84,3.62,3.62,0,0,1-.93,1.18c-.5.33-.52.33-5.37.31l-4.88,0V41.54h3.24c3.12,0,3.26,0,3.7.32a3,3,0,0,1,.78,1c.56,1.17.67.81.67-2.1s-.11-3.2-.7-2-.69,1.26-4.42,1.26H84.05l0-3.13,0-3.12h4.3c4.09,0,4.34,0,4.81.31a2.07,2.07,0,0,1,.8,1c.51,1.2.69,1,.69-1,0-1.4,0-1.69-.24-1.77S79.64,32.3,79.52,32.44Zm-23,.2c-.13.19-.15.18.69.55a2.21,2.21,0,0,1,1,.79c.28.47.3.71.3,9.91,0,7.58,0,9.47-.21,9.67a3.27,3.27,0,0,1-1,.64c-.46.2-.82.42-.82.51a15.89,15.89,0,0,0,3.4.15c3.62,0,3.94-.07,2.56-.62a3.32,3.32,0,0,1-1.08-.65c-.32-.36-.32-.38-.29-4.88l0-4.52,3.76-.09a21.78,21.78,0,0,0,4.44-.31c2.91-1,4.78-3.82,4.25-6.48a5.64,5.64,0,0,0-3-4.08c-1.48-.7-2-.75-8.11-.75A40.21,40.21,0,0,0,56.52,32.64ZM69,34.13A4,4,0,0,1,70.71,36a4.15,4.15,0,0,1,.39,2.29,4.76,4.76,0,0,1-.36,2.23,3.59,3.59,0,0,1-2,2,38.52,38.52,0,0,1-7.38.16c-.32-.17-.32-.22-.32-4.28,0-2.25,0-4.21.09-4.34s.47-.24,3.8-.19C68,33.88,68.67,33.92,69,34.13Zm33.46-1.55c-.21.21-.08.34.63.65a2.29,2.29,0,0,1,1,.8c.28.47.29.72.29,9.91,0,10.67.11,9.79-1.25,10.3-.4.16-.73.38-.73.49s.59.22,3,.25c4,.06,4.45-.08,2.88-.71s-1.42-.4-1.37-5.58l0-4.5,1.94,0,2,0,.3.48c.16.27,1.2,2.27,2.32,4.45,2.81,5.52,3.15,5.83,6.39,5.83a4.91,4.91,0,0,0,1.59-.12,6.29,6.29,0,0,0-1.31-.72,5,5,0,0,1-1.87-1.28,84,84,0,0,1-4.55-8.63,1.76,1.76,0,0,1,.74-.2,7.12,7.12,0,0,0,3.28-1.77,5.66,5.66,0,0,0,1.53-4.74,6.32,6.32,0,0,0-1.69-3.24,7.31,7.31,0,0,0-3.34-1.52C113.26,32.47,102.65,32.42,102.49,32.58ZM115,34.13A4,4,0,0,1,116.65,36,4.12,4.12,0,0,1,117,38.3c0,2.12-.54,3.22-1.91,3.94-.56.31-.78.33-4.35.33H107l0-4.2c0-2.31,0-4.28,0-4.39s.81-.19,3.78-.14C113.94,33.88,114.6,33.92,115,34.13Zm9.72-1.33a9.07,9.07,0,0,0,.17,3.17c.09,0,.33-.31.53-.75.52-1.12.92-1.3,3-1.38a19.6,19.6,0,0,1,2.16,0l.53.11V53.23l-.32.36a3.25,3.25,0,0,1-1,.64c-.37.14-.69.32-.69.41a14.8,14.8,0,0,0,3.29.15,14.94,14.94,0,0,0,3.3-.15c0-.09-.32-.27-.69-.41a3.08,3.08,0,0,1-1-.64l-.33-.36V34.12l.3-.18a7.25,7.25,0,0,1,2.18-.1c2.29,0,2.71.25,3.24,1.41.21.43.44.75.52.72a4.34,4.34,0,0,0,.16-1.74V32.55l-7.61,0-7.63,0ZM1.53,36.46c0,.07.22.25.49.38,1.07.54,1-.16,1,8.41,0,4.53-.06,7.83-.13,8a2,2,0,0,1-.75.53c-1,.47-.68.58,1.84.58s2.93-.13,2-.51-1,.23-1-8.45c0-4.3,0-7.89.11-8a2.92,2.92,0,0,1,.74-.49c.34-.17.62-.38.62-.45A8.66,8.66,0,0,0,4,36.31,8.78,8.78,0,0,0,1.53,36.46Zm42.25,6.39v4.56l.84,1.47c.46.83,2.15,3.67,3.76,6.35,2.85,4.75,2.91,4.87,2.91,5.67A2.78,2.78,0,0,1,50,63.3c-.68.45-.78.75-.34,1,.19.09,2.65.15,7,.15,5.91,0,6.72,0,6.92-.24.39-.38.09-.63-1.43-1.23a20.22,20.22,0,0,1-4.78-2.65c-.8-.64-1.21-1.3-6.88-10.79C47.17,44,44.3,39.15,44.12,38.86l-.32-.56ZM33.13,52.08c-3.44,5.71-4.55,7.46-5,7.83A20,20,0,0,1,22.63,63c-.92.34-1.08.45-1.08.75a.47.47,0,0,0,.24.42c.13,0,2.74.09,5.8.09,4.89,0,5.58,0,5.76-.23.29-.36,0-.65-1-1s-1.56-.87-1.56-1.37c0-.22,1.71-3.2,4.19-7.36l4.2-7-.75-1.23c-.43-.7-.81-1.27-.85-1.3S35.54,48,33.13,52.08Z'
  const faults = []
  for (const prop in data.checkInStat) {
    if (!data.checkInStat[prop]) {
      faults.push(prop)
    }
    if (prop === 'notes') {
      faults.push(`Notes: ${data.checkInStat[prop]}`)
    }
  }

  const address = 'shop 5                foreshore place    (ABSA building)       cape town'
  const tel = '0618830294'
  const t1 = '1- We can only be liable for parts that we change'
  const t2 = '2- All repair efforts, attempts and parts are none refundable'
  const t3 = '3- Any physical or liquid damage will not be covered by any warranty'
  const t4 = '4- There will be no warranty for any data loss'
  const t5 = '5- Please make sure that you have removed your sim, SD card and important data on the phone'
  const date = new Date()
  doc.path(logo).translate(140, 20).stroke()
  doc.text(`${address}`, -100, 10, { width: 130 })
  doc.text(`${tel}`)
  doc.fontSize(10).text(`${date.toDateString()}  ${date.getHours()}:${date.getMinutes()}`, 150, 91)

  doc.moveTo(-140, 80)
    .lineTo(419.53, 80)
    .stroke()

  doc.fontSize(14).text(`Repair Slip:   ${data.slipNumber}`, -5, 88).fontSize(10)
  doc.moveTo(-140, 105)
    .lineTo(419.53, 105)
    .stroke()
  doc.text('Client details: ', -100, 110)
  doc.text(`Name: ${data.customerName}`)
    .text(`Phone number: ${data.customerPhone}`)
    .text(`Email: ${data.customerEmail}`).moveDown()
    .moveTo(-140, 185)
    .lineTo(419.53, 185)
    .stroke()
  doc.text('Device details: ', 90, 110).text(`Brand: ${data.brand}`).text(`Model: ${data.model}`)
    .text(`color: ${data.color}`)
    .text(`Passcode: ${data.passCode}`).text(`IMEI: ${data.imei}`).moveDown()
  doc.moveTo(-140, 200)
    .lineTo(419.53, 200)
    .stroke().save()
  doc.text('Device faults: ', -100, 190).moveDown()
  doc.moveTo(-140, 330)
    .lineTo(419.53, 330)
    .stroke()
  faults.forEach((fault) => {
    doc.text(fault)
  })
  doc.moveTo(70, 185)
    .lineTo(70, 330)
    .stroke()
  doc.text('Repairs to be done:', 100, 190, { width: 220 }).moveDown()
  data.neededRepairs.forEach((repair) => {
    doc.text(repair)
  })
  doc.moveTo(-140, 490)
    .lineTo(419.53, 490)
    .stroke()
  doc.moveDown().text(`Total: R${data.total}`)
  doc.text('Terms and Conditions: ', -100, 335).moveDown().text(t1).text(t2).text(t3).text(t4).text(t5, { width: 300 })

    .text(`Prepared by: ${data.cashier}`, -110, 500).text('Client signature:', 90, 500)

  doc.moveTo(70, 490)
    .lineTo(70, 580)
    .stroke()

  doc.end()
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
  getSlipNo,
  genSlipPdf,
  insertInv,
  getInvItems,
  updateInv,
  insertInvoice,
  getInvoiceNo,
  genInvoice
}
