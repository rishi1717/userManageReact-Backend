const express = require("express")
const router = express.Router()
const { Users, validate } = require("../mongo/userModel")
const bcrypt = require("bcrypt")
const joi = require("joi")
require("dotenv").config()

router.get("/", async (req, res) => {
	try {
		let value = new RegExp(req.query.search, "i")
		let users = await Users.find({
			$or: [{ name: value }, { email: value }],
		})
		res.status(201).send({ users, message: "Users searched" })
	} catch (err) {
		console.log(err.message)
	}
})

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body)
		if (error)
			return res.status(400).send({ message: error.details[0].message })
		const user = await Users.findOne({ email: req.body.email })
		if (user)
			return res
				.status(409)
				.send({ message: "User with this email already exist!" })

		const salt = await bcrypt.genSalt(Number(process.env.SALT))
		const hashPassword = await bcrypt.hash(req.body.password, salt)

		await new Users({ ...req.body, password: hashPassword }).save()
		res.status(201).send({ message: "User created succesfully" })
	} catch (err) {
		res.status(500).json({ message: "Internal server error" })
	}
})

router.put("/", async (req, res) => {
	try {
		const { error } = updateValidate({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone.toString(),
		})
		if (error)
			return res.status(400).send({ message: error.details[0].message })
		await Users.updateOne(
			{ _id: req.body._id },
			{ name: req.body.name, email: req.body.email, phone: req.body.phone }
		)
		const users = await Users.find()
		res.status(201).send({ users, message: "User Updated succesfully" })
	} catch (err) {
		console.log(err.message)
		res.status(500).json({ message: "Internal server error" })
	}
})

router.delete("/", async (req, res) => {
	try {
		await Users.findByIdAndDelete(req.body._id)
		const users = await Users.find()
		res.status(201).send({ users, message: "User Deleted succesfully" })
	} catch (error) {
		console.log(err.message)
		res.status(500).json({ message: "Internal server error" })
	}
})

const updateValidate = (data) => {
	const schema = joi.object({
		name: joi.string().required().label("name"),
		email: joi.string().required().label("email"),
		phone: joi.string().label("phone"),
	})
	return schema.validate(data)
}

module.exports = router
