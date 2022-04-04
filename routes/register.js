const express = require("express")
const router = express.Router()
const { Users, validate } = require("../mongo/userModel")
const bcrypt = require("bcrypt")
require("dotenv").config()

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

module.exports = router
