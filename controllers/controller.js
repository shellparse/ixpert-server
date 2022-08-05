const { createUser, getUserById, editUserById, insertCustomer } = require('../services/service.js')

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
module.exports = {
  signUp,
  findUser,
  editUser,
  createCustomer
}
// how the service will export usable function to deal with the database
// module.exports=async function userSignup(username,name,password){
//     await service(...arguments);
// }
