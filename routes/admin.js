const express = require("express")
const router = express.Router()
const { Users } = require("../mongo/userModel")
const adminModel = require("../mongo/adminModel")
const joi = require("joi")

const validate = (data) => {
	const schema = joi.object({
		adminid: joi.string().required().label("adminid"),
		password: joi.string().required().label("password"),
	})
	return schema.validate(data)
}

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body)
		if (error)
			return res.status(400).send({ message: error.details[0].message })
		const adminFound = await adminModel.findOne({
			adminId: req.body.adminid,
			password: req.body.password,
		})
		if (adminFound) {
			res.status(200).send({admin:'true',  message: "Login succesfull" })
		} else {
			res.status(401).send({ message: "Invalid credentials" })
		}
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: "Some internal server error occured" })
	}
})

router.get('/',async (req,res)=>{
	try {
		let users = await Users.find()
		res.status(200).send({users})
	} catch (error) {
		console.log(error.message);
	}
})

module.exports = router
