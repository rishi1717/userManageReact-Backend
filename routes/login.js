const router = require("express").Router
const { Users } = require("../mongo/userModel")
const bcrypt = require("bcrypt")
const joi = require("joi")

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body)
		if (error) res.status(400).send({ message: error.details[0].message })

		const user = await Users.findOne({ email: req.body.email })
		if (!user) res.status(401).send({ message: "Invalid email!" })

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		)

		if (!validPassword) res.status(401).send({ message: "Invalid password!" })

		const token = user.generateAuthToken()

		res.status(200).send({ data: token, message: "Logged in succesfully" })
	} catch (error) {
		res.status(500).send({ message: "Some internal server error occured" })
	} 
})

const validate = (data) => {
	const schema = joi.object({
		email: joi.string().email().required().label("email"),
		password: string().required().label("password"),
	})
	return schema.validate(data)
}

module.exports = router
