require('dotenv').config();
const {MongoClient} =require("mongodb");
const {MongoMemoryServer } = require("mongodb-memory-server");

module.exports=async function (){
    let client;
    if(process.env.NODE_ENV==="development"){
        const mongod =await MongoMemoryServer.create()
        client = new MongoClient(mongod.getUri());
            console.log(`local mongodb uri is: ${mongod.getUri()}`);
    }else {
        client = new MongoClient(process.env.mongo_URI);
    }
    client.connect((err)=>console.log("connected to db"));
    return client;
}
