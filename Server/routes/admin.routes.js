const express= require("express");
const route = express.Router();
const adminController= require("../controllers/Admin.controller");

route.post("/adminlogin", adminController.adminLogin)
route.post("/register", adminController.adminRegister);





module.exports=route;