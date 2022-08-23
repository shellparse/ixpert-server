const { ObjectID } = require('bson')
const { insertInv, genSlipPdf, getSlipNo, getCustomers, genSlip, getCustomerById, createUser, getUserById, editUserById, insertCustomer, getCustomerByPhone, insertSlip, getSlip } = require('../services/service.js')

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
async function genSlipNo () {
  return await genSlip()
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
module.exports = {
  signUp,
  findUser,
  editUser,
  createCustomer,
  retrieveCustomer,
  createSlip,
  retrieveSlip,
  genSlipNo,
  retrieveCustomers,
  retrieveSlipNo,
  createSlipPdf,
  createInv
}
