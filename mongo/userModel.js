const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

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
	phone: {
		type: Number,
	},
})

userSchema.methods.generateAuthToken = () => {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY,{expiresIn:'7d'})
	return token
}

const Users = mongoose.model("users", userSchema)

const validate = (data) => {
	const schema = joi.object({
		name: joi.string().required().label("name"),
		email: joi.string().required().label("email"),
		phone: joi.string().label("phone"),
		password: passwordComplexity().required().label('password')
	})
	return schema.validate(data)
}

module.exports = {Users, validate}