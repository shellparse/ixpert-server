const client =  require("../database/connection.js");
const models = require("../database/models.js")
client.connect((err)=>{
    if(!err){
        let shopDb=client.get().db("shop");
        let users = shopDb.collection("user");
     }
    });




// module.exports=db.then((db)=>{
//         async function createUser(username,name,password){
//         let users = db.collection("user");
//         return await users.insertOne({username:username,name:name,password:password});
//     }
// })
