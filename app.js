const app = require('express')()
const router = require('./api/routes.js')
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json())
app.use(router)

// open the database connection at startup and start listening
console.log('app starting')
app.listen(process.env.PORT || 3000, () => {
  console.log('server is listening')
})
