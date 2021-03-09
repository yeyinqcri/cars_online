const express = require('express');
const routes=express.Router();

//routing config

routes.get("/",(req,res)=>{
res.render("index");
});

module.exports=routes;