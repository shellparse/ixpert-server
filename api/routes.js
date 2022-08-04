const express = require('express')
const router = express.Router()
const { signUp, findUser } = require('../controllers/controller.js')
// const client = require('../database/connection.js')

router.get('/', (req, res) => {
  res.send('hello router')
})
router.route('/user').post(async (req, res) => {
  const { username, name, password } = req.body
  const response = await signUp(username, name, password)
  res.json({ response })
})
router.route('/user/:id').get(async (req, res) => {
  res.json(await findUser(req.params.id))
})

module.exports = router
