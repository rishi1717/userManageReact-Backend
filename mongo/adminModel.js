const mongoose = require("mongoose")

let adminSchema = new mongoose.Schema({
	adminId: {
		type: String,
		required: "Required",
	},
	password: {
		type: String,
	},
})

module.exports = mongoose.model("admins", adminSchema)
