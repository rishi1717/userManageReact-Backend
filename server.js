const { v4: uuidv4 } = require("uuid")
const express = require("express")
require("dotenv").config()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const connection = require("./mongo")
const userModel = require("./mongo/userModel")

const app = express()

const port = process.env.PORT || 3001
const secretKey = process.env.JWT_KEY

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.post("/api/register", async (req, res) => {
	try {
		await userModel.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			phone: req.body.phone,
		})
		res.json({ status: "ok" })
	} catch (err) {
		res.status(400).json({ status: "error", error: err.message })
	}
})

app.post("/api/login", async (req, res) => {
	const user = await userModel.findOne({
		email: req.body.email,
		password: req.body.password,
	})
	if (user) {
		const token = jwt.sign(
			{
				email: user.email,
				name: user.name,
			},
			secretKey
		)
		return res.json({ status: "ok", user: token })
	} else {
		return res.status(401).json({ status: "error", user: false })
	}
})

app.listen(port, (err) => {
	if (err) {
		console.log("error creating server")
	} else {
		console.log(`Listening at http://localhost:${port}`)
	}
})
