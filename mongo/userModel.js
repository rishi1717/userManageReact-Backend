const mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "Required",
		trim: true,
		minlength: [2, "Atleast 2 character required"],
	},
	password: {
		type: String,
		minlength: [6, "Atleast 6 character required"],
	},
	email: {
		type: String,
		trim: true,
		unique: true,
	},
    phone:{
        type: Number
    }
})

module.exports = mongoose.model("users", userSchema)
