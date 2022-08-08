const express = require('express')
const router = express.Router()
const { signUp, findUser, editUser, createCustomer, retrieveCustomer, createSlip, retrieveSlip } = require('../controllers/controller.js')

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
  const { name, email, phoneNumber } = req.body
  res.json(await createCustomer(name, email, phoneNumber))
})
  .get(async (req, res) => {
    res.json(await retrieveCustomer(req.body.phoneNumber))
  })
// router.route('/inventory').post(async (req, res) => {
// })
router.route('/slip').post(async (req, res) => {
  const { customerId, imei, slipNumber, checkInStat, brand, model, neededRepairs, total, cashier } = req.body
  res.json(await createSlip(customerId, slipNumber, imei, checkInStat, brand, model, neededRepairs, total, cashier))
}).get(async (req, res) => {
  res.json(await retrieveSlip(req.body.slipNumber))
})
module.exports = router
