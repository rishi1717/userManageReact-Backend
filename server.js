const express = require("express")
const cors = require("cors")
const connection = require("./mongo")
const registerRoute = require('./routes/register')
const loginRoute = require('./routes/login')
const adminRoute = require('./routes/admin')
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3001

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//routes
app.use('/api/register',registerRoute)
app.use('/api/login',loginRoute)
app.use('/api/admin',adminRoute)

app.listen(port, (err) => {
	if (err) {
		console.log("error creating server")
	} else {
		console.log(`Listening at http://localhost:${port}`)
	}
})
