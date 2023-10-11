const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const remindershema = mongoose.Schema(
	{
        
		createdby:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
            required: true
		},
		date: {
			type: String,
			require: true
		},
		subject: {
			type: String,
			require: true
		},
		description: {
			type: String,
			require: true
		},
		email: {
			type: String,
            default:""
		},
		contact: {
			type: Number,
            default:""

		},
		sms: {
			type: Number,
            default:""
		},
		recurfornext: {
			type: String,
            default:""
		}
	}
)

const Reminder= mongoose.model("Reminder", remindershema );
module.exports =Reminder;
