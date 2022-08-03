const app = require("express")();
const db = require("./database/connection.js");
const router = require("./api/routes.js");
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(router);


//open the database connection at startup and start listening 

    app.listen(process.env.PORT||3000,()=>{
        console.log("server is listening");
    })

