const { ObjectID } = require('bson')
const { genSlip, getCustomerById, createUser, getUserById, editUserById, insertCustomer, getCustomerByPhone, insertSlip, getSlip } = require('../services/service.js')

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
async function createSlip (customerId, slipNumber, imei, checkInStat, brand, model, neededRepairs, total, cashier) {
  return await insertSlip(...arguments)
}
async function retrieveSlip (slipNumber) {
  return await getSlip(slipNumber)
}
async function genSlipNo () {
  return await genSlip()
}
module.exports = {
  signUp,
  findUser,
  editUser,
  createCustomer,
  retrieveCustomer,
  createSlip,
  retrieveSlip,
  genSlipNo
}
