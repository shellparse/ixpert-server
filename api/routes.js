var express = require('express');
var router = express.Router();
const controller = require("../controllers/controller.js");
const db = require("../database/connection.js");

router.get("/",(req,res)=>{
console.log(db.get().db("mido"));

    res.send("hello router");
});
router.post("/users",async (req,res)=>{
    res.json(controller(req.body));
})




module.exports=router;