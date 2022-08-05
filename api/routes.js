const express = require('express')
const router = express.Router()
const { signUp, findUser, editUser, createCustomer } = require('../controllers/controller.js')

router.get('/', (req, res) => {
  res.send('hello router')
})

router.route('/user').post(async (req, res) => {
  const { username, name, password } = req.body
  // const response =
  res.json(await signUp(username, name, password))
})
router.route('/user/:id').get(async (req, res) => {
  res.json(await findUser(req.params.id))
}).put(async (req, res) => {
  res.json(await editUser(req.params.id, req.body.username))
})
router.route('/customer').post(async (req, res) => {
  res.json(await createCustomer(...req.body))
})

module.exports = router
