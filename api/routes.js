const controller = require("../controllers/controller.js");

    module.exports= async function(app){
    app.get("/",(req,res)=>{
        res.send("hello routes"+controller);
    })
}
