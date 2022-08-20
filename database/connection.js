require('dotenv').config()
const { MongoClient } = require('mongodb')


let client

async function connect (callback) {
  if (process.env.NODE_ENV === 'development') {
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create()
    client = new MongoClient(mongod.getUri())
    console.log(`local mongodb: ${mongod.getUri()}`)
  } else {
    client = new MongoClient(process.env.mongo_URI)
  }
  client.connect((err, client) => {
    if (err)callback(err)
    console.log('connected to db')
  })
  callback()
}

function get () {
  return client
}

function close () {
  client.close()
}

module.exports = {
  connect,
  get,
  close
}
