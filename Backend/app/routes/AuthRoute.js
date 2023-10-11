const express = require("express");
const User = require("../model/UserModel");
const { protect } = require("../middleware/auth");

const {
	registerUser,
	login,
	setReminder,
	deleteReminder,
	editReminder,
	getProfile,
	getrem
	 
} = require("../controller/Auth/AuthController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/getreminder/:createdby", getrem);
 

router.get("/get-user-details", protect, getProfile);
 
router.put("/edit",protect,editReminder);
router.delete("/delete",protect,deleteReminder);
router.post("/set",protect,setReminder)
router.post("/login", login);
 
 

module.exports = router;
