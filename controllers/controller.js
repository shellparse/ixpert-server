const { createUser, getUserById } = require('../services/service.js')

async function signUp () {
  const created = await createUser(...arguments)
  return created
}
async function findUser (id) {
  return await getUserById(id)
}
module.exports = {
  signUp,
  findUser
}
// how the service will export usable function to deal with the database
// module.exports=async function userSignup(username,name,password){
//     await service(...arguments);
// }
