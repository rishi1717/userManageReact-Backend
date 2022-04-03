const { v4: uuidv4 } = require("uuid")
const express = require("express")
require("dotenv").config()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const connection = require("./mongo")
const userModel = require("./mongo/userModel")

const app = express()

const port = process.env.PORT || 3001

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

app.listen(port, (err) => {
	if (err) {
		console.log("error creating server")
	} else {
		console.log(`Listening at http://localhost:${port}`)
	}
})
