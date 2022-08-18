const express = require('express')
const router = express.Router()
const { createSlipPdf, retrieveSlipNo, retrieveCustomers, genSlipNo, signUp, findUser, editUser, createCustomer, retrieveCustomer, createSlip, retrieveSlip } = require('../controllers/controller.js')

router.get('/', (req, res) => {
  res.send('hello router')
})
router.route('/slipnumber').post(async (req, res) => {
  res.json(await genSlipNo())
})
  .get(async (req, res) => {
    res.json(await retrieveSlipNo())
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
}).get(async (req, res) => {
  const { amount = 10 } = req.query
  res.json(await retrieveCustomers(amount))
})
  .get(async (req, res) => {
    res.json(await retrieveCustomer(req.body.phoneNumber))
  })
router.route('/customer/:id').get(async (req, res) => {
  res.json(await retrieveCustomer(req.params.id))
})
// router.route('/inventory').post(async (req, res) => {
// })
router.route('/slip').post(async (req, res) => {
  const { customerId, imei, slipNumber, checkInStat, brand, model, neededRepairs, total, cashier, returned, passCode, customerName, customerPhone, customerEmail } = req.body
  const newSlip = await createSlip(customerId, slipNumber, imei, checkInStat, brand, model, neededRepairs, total, cashier, returned, passCode)
  if (newSlip.acknowledged) {
    await createSlipPdf({ customerId, imei, slipNumber, checkInStat, brand, model, neededRepairs, total, cashier, returned, passCode, customerName, customerPhone, customerEmail }, res)
  } else {
    res.json({ Error: 'could"nt insert in database' })
  }
}).get(async (req, res) => {
  res.json(await retrieveSlip(req.body.slipNumber))
})
module.exports = router
