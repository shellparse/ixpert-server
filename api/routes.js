const express = require('express')
const router = express.Router()
const { retrieveInvoice, genInvoiceNo, retrieveInvoiceNo, createInvoice, editInv, retrieveInvItems, createInv, retrieveSlipNo, retrieveCustomers, signUp, findUser, editUser, createCustomer, retrieveCustomer, createSlip, retrieveSlip } = require('../controllers/controller.js')

router.get('/', (req, res) => {
  res.send('hello router')
})
router.route('/slipnumber').get(async (req, res) => {
  res.json(await retrieveSlipNo())
})
router.route('/user').post(async (req, res) => {
  const { username, name, password } = req.body
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
router.route('/slip').post(async (req, res) => {
  await createSlip(req.body, res)
}).get(async (req, res) => {
  res.json(await retrieveSlip(req.body.slipNumber))
})
router.route('/inventory').post(async (req, res) => {
  const { sku, category = '', name, description = '', price, lastUpdated = new Date(), quantity, image = '', brand = '', model = '', imei = '', ram = '', storage = '', color = '' } = req.body
  const newInv = await createInv(sku, category, name, description, price, lastUpdated, quantity, image, brand, model, imei, ram, storage, color)
  res.json(newInv)
}).get(async (req, res) => {
  res.json(await retrieveInvItems(req.query.sku))
})
router.route('/inventory/:id').put(async (req, res) => {
  res.json(await editInv(req.params.id, req.body))
})
router.route('/salesinvoice').post(async (req, res) => {
  await createInvoice(req.body, res)
}).get(async (req, res) => {
  res.json(await retrieveInvoice(req.query.no))
})
router.route('/invoicenumber').get(async (req, res) => {
  res.json(await retrieveInvoiceNo())
})
  .post(async (req, res) => {
    res.json(await genInvoiceNo())
  })
module.exports = router
