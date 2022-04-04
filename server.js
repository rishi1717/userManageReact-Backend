const express = require("express")
require("dotenv").config()
const cors = require("cors")
const connection = require("./mongo")
const registerRoute = require('./routes/register')
const loginRoute = require('./routes/login')
const app = express()

const port = process.env.PORT || 3001
const secretKey = process.env.JWT_KEY

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//routes
app.use('/api/register',registerRoute)
app.use('/api/login',loginRoute)

app.listen(port, (err) => {
	if (err) {
		console.log("error creating server")
	} else {
		console.log(`Listening at http://localhost:${port}`)
	}
})
