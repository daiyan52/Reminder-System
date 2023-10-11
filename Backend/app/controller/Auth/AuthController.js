const User = require("../../model/UserModel");
const Remind=require("../../model/ReminderMode")
const axios = require('axios');
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

const asynchandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const dotenv = require("dotenv").config();
 
const registerUser = asynchandler(async (req, res) => {
	try {
		console.log("userRegister is calling")
		const { full_name, email,  password} = req.body;
		const userExist = await User.findOne({ email});
		if (userExist) {
			return res.status(409).json({ status: false, message: "Email already in use" });
		}
		const user = await User.create({
			full_name,
			email,
			password
			 
		});

		if (user) {
			const Getdata = await User.findOne({ _id: user._id })
			res.status(201).json({
				status: true,
				message: "register successfully",
				data: Getdata,
				token: generateToken(user._id),
			});
		} else {
			res.status(404).json({
				status: false,
				message: "Error Occured",
			});
		}
	} catch (e) {
		res.status(500).json({
			status: false,
			message: e.message,
		});
	}
});

 

 

 

const UpdateProfile = asynchandler(async (req, res) => {
	try {
		const _id = req.params._id;
		const query = {};



		// let CheckMObile = await User.find({ _id: { $ne: req.params._id }, mobile_number: req.body.mobile_number });

		// if (CheckMObile.length > 0) {
		// 	return res.status(409).json({
		// 		status: false,
		// 		message: "Mobile already registed with another user",
		// 		data: CheckMObile
		// 	});
		// }
		if (req.body.full_name) {
			query.full_name = req.body.full_name;
		}

		if (req.body.mobile_number) {
			query.mobile_number = req.body.mobile_number;
		}

		if (req.body.dob) {
			query.dob = req.body.dob;
		}

		if (req.body.address) {
			query.address = req.body.address;
		}

		if (req.body.city) {
			query.city = req.body.city;
		}

		if (req.body.state) {
			query.state = req.body.state;
		}

		if (req.body.pincode) {
			query.pincode = req.body.pincode;
		}

		if (req.body.gender) {
			query.gender = req.body.gender;
		}
		if (req.body.description) {
			query.description = req.body.description;
		}
		if (req.body.total_sell) {
			query.total_sell = req.body.total_sell;
		}



		// if (req.files) {
		// 	if (req.files.pic) {
		// 		let element = req.files.pic;
		// 		let param = {
		// 			Bucket: process.env.Bucket,
		// 			Body: element.data,
		// 			Key: `user/${new Date().getTime()}${element.name}`,
		// 		};
		// 		let s3Routes = await uploadFile(param);

		// 		let dataaa = s3Routes.Location.split('.com')

		// 		query.pic = "https://djur1ntoovcoi.cloudfront.net" + dataaa[1]
		// 	}

		// 	if (req.files.certificate) {
		// 		let element = req.files.certificate;
		// 		let param = {
		// 			Bucket: process.env.Bucket,
		// 			Body: element.data,
		// 			Key: `user/${new Date().getTime()}${element.name}`,
		// 		};
		// 		let s3Routes = await uploadFile(param);

		// 		let dataaa = s3Routes.Location.split('.com')

		// 		query.certificate = "https://djur1ntoovcoi.cloudfront.net" + dataaa[1]

		// 	}

		// }


		console.log(query);

		const user = await User.findByIdAndUpdate({ _id: _id }, query, { returnDocument: "after" });

		return res.status(200).json({
			code: 200,
			msg: "profile updated successfully",
			user: user,
		});
	} catch (e) {
		res.status(500).json({
			status: false,
			message: "server error",
			meta: e.message,
		});
	}
});

 

const getProfile = asynchandler(async (req, res) => {
	try {
		const { user_id } = req.query;

		const sssd = await User.findOne({ _id: user_id }).populate("visting_card_id");
		let FollowerCount = await Follower.countDocuments({ user_id: ObjectId(user_id) })
		let FollowingCount = await Following.countDocuments({ user_id: ObjectId(user_id) })
		res.status(200).json({
			status: true,
			message: "data saved",
			data: { data: sssd, count: { FollowerCount: FollowerCount, FollowingCount: FollowingCount } },
		});
	} catch (e) {
		res.status(500).json({
			status: false,
			message: "server error",
		});
	}
});

const login = asynchandler(async (req, res) => {
	try {
		console.log("log is calling")
		const { email, password} = req.body;
			const comp = await User.findOne({ email });
			if (comp && (await comp.matchPassword(password))) {
				res.json({
					status: true,
					message: "logged in",
					data: comp,
					token: generateToken(comp._id),
				});
			} else {
				res.status(400).json({
					status: false,
					message: "invalid email or password",
				});
			}
	} catch (e) {
		res.status(500).json({
			status: false,
			message: e.message,
		});
	}
});
const  editReminder=asynchandler(async(req,res)=>{
	try {
		console.log("log is calling")
		const {date,subject,description,email,contact,sms,recurfornext,_id}=req.body
		const updatedFields = {};

        // Check which fields are present in the request body and add them to the updatedFields object
        if (date) updatedFields.date = date;
        if (subject) updatedFields.subject = subject;
        if (description) updatedFields.description = description;
        if (email) updatedFields.email = email;
        if (contact) updatedFields.contact = contact;
        if (sms) updatedFields.sms = sms;
        if (recurfornext) updatedFields.recurfornext = recurfornext;
		const updatedUser = await User.findByIdAndUpdate(_id, updatedFields, { new: true });
		res.status(200).json({
			status: true,
			message: updatedUser,
		});
			 
	} catch (e) {
		res.status(500).json({
			status: false,
			message: e.message,
		});
	}
});

const  setReminder=asynchandler(async(req,res)=>{
	try {
		 console.log("set reminder is calling")
		const {date,subject,description,email,contact,sms,recurfornext,createdby}=req.body
		// const d=Remind.insertOne({createdby:id,date:date,subject:subject,description:description,email:email,contact:contact,sms:sms,recurfornext:recurfornext})
		const newUser = new Remind({
            createdby,
			date,
			subject,
			description,
			email,
			contact,
			sms,
			recurfornext
		});
		newUser.save();
		//const d=newUser.populate("createdby")
		 
		res.status(200).json({
			status: true,
			message:newUser,
		});
			 
	} catch (e) {
		res.status(500).json({
			status: false,
			message: e.message,
		});
	}
});


const  deleteReminder=asynchandler(async(req,res)=>{
	try {
		 
		 const {_id}=req.body;
		 const d=Remind.findByIdAndDelete(_id);
		 
		 
		res.status(200).json({
			status: true,
			message:"deleted",
		});
			 
	} catch (e) {
		res.status(500).json({
			status: false,
			message: e.message,
		});
	}
});

const  getrem=asynchandler(async(req,res)=>{
	try {
		console.log("getdata call")
		 
		 const {_id}=req.query;

		 console.log(_id)
		 const d=await Remind.find({createdby:_id});
		 
		 console.log(d)
		res.status(200).json({
			status: true,
			message:d,
		});
			 
	} catch (e) {
		res.status(500).json({
			status: false,
			message: e.message,
		});
	}
});

 

 

 

 

 

 






 
module.exports = {
	registerUser,
	login,
	editReminder,
	UpdateProfile,
	setReminder,
	deleteReminder,
	getProfile,
	getrem
	 
};
