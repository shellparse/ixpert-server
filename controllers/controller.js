const client =  require("../database/connection.js");

async function main(){
    const db = (await client()).db("shop");
    const collection = db.collection("user");
    console.log(collection);
}
main();
