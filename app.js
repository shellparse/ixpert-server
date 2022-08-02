const app = require("express")();
const routes = require("./api/routes.js");
require('dotenv').config();
routes(app);


app.listen(process.env.PORT||3000,()=>{
    console.log("server is listening");
});
