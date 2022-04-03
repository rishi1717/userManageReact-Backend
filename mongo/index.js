const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(`${process.env.db_connect}`, (err) => {
	if (err) {
		console.log(err.message)
		console.log("error connecting MongoDB")
	} else {
		console.log("Connected to MongoDB")
	}
})
