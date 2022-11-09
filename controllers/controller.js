const { ObjectID } = require('bson')
const { getInvoice, genInvoicePdf, genInvoice, getInvoiceNo, insertInvoice, updateInv, getInvItems, insertInv, genSlipPdf, getSlipNo, getCustomers, getCustomerById, createUser, getUserById, editUserById, insertCustomer, getCustomerByPhone, insertSlip, getSlip } = require('../services/service.js')

async function signUp () {
  const createdUser = await createUser(...arguments)
  if (createdUser instanceof Error) {
    return JSON.stringify(createdUser)
  }
  return createdUser
}
async function findUser (id) {
  return await getUserById(id)
}
async function editUser (id, username) {
  return await editUserById(id, username)
}
async function createCustomer (name, email, phoneNumber) {
  return await insertCustomer(...arguments)
}
async function retrieveCustomer (param) {
  if (param) {
    if (param === new ObjectID(param).toString()) {
      return await getCustomerById(param)
    } else {
      return await getCustomerByPhone(param)
    }
  }
}
async function createSlip () {
  return await insertSlip(...arguments)
}
async function retrieveSlip (slipNumber) {
  return await getSlip(slipNumber)
}
async function retrieveCustomers (amount) {
  return await getCustomers(amount)
}
async function retrieveSlipNo () {
  return await getSlipNo()
}
async function createSlipPdf (data, res) {
  return await genSlipPdf(data, res)
}
async function createInv () {
  return await insertInv(...arguments)
}
async function retrieveInvItems (sku) {
  return await getInvItems(sku)
}
async function editInv () {
  return await updateInv(...arguments)
}
async function createInvoice (invoice, res) {
  const { customerDetails, ...rest } = invoice
  const newInvoice = await insertInvoice(rest)
  if (newInvoice.acknowledged) {
    try {
      if (invoice.customerDetails) {
        genInvoicePdf(invoice, res)
      } else {
        throw Error
      }
    } catch (e) {
      res.json({ error: 'invoice created but failed to generate pdf' })
    }
  }
}
async function retrieveInvoiceNo () {
  return await getInvoiceNo()
}
async function genInvoiceNo () {
  return await genInvoice()
}

async function retrieveInvoice (no) {
  return await getInvoice(no)
}
module.exports = {
  signUp,
  findUser,
  editUser,
  createCustomer,
  retrieveCustomer,
  createSlip,
  retrieveSlip,
  retrieveCustomers,
  retrieveSlipNo,
  createSlipPdf,
  createInv,
  retrieveInvItems,
  editInv,
  createInvoice,
  retrieveInvoiceNo,
  genInvoiceNo,
  retrieveInvoice
}
