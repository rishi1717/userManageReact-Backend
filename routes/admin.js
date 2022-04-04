const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const userModel = require("../mongo/userModel")
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
        // console.log(error)
		if (error)
			return res.status(400).send({ message: error.details[0].message })
        // console.log(req.body.adminid)
		const adminFound = await adminModel.findOne({
			adminId: req.body.adminid,
			password: req.body.password,
		})
        // console.log(adminFound)
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

router.get("/adminPanel", async (req, res) => {
	try {
		if (req.session.admin) {
			let users = await userModel.find()
			let blogs = await blogModel.find()
			blogNo = blogs.length
			len = users.length
			res.status(200).render("adminPanel", {
				admin: req.body.admin,
				users: users,
				len: len,
				blogNo: blogNo,
				success: req.flash("message"),
			})
		} else res.status(403).render("adminUnauthorized")
	} catch (err) {
		console.log(err.message)
	}
})

router.get("/search", async (req, res) => {
	try {
		if (req.session.admin) {
			let value = new RegExp(req.query.search, "i")
			let result = await userModel.find({
				$or: [{ name: value }, { userName: value }, { email: value }],
			})

			let blogs = await blogModel.find()
			len = result.length
			blogNo = blogs.length
			res.status(200).render("adminPanel", {
				admin: req.body.admin,
				users: result,
				len: len,
				blogNo: blogNo,
			})
		} else {
			res.status(403).render("adminUnauthorized")
		}
	} catch (err) {
		console.log(err.message)
	}
})

router.get("/addUser", (req, res) => {
	try {
		if (req.session.admin) {
			let err = req.flash("error")
			if (err) res.status(400)
			else res.status(200)
			res.render("addUser", { duplicateError: err })
		} else res.status(403).render("adminUnauthorized")
	} catch (err) {
		console.log(err.message)
	}
})

router.post("/user", async (req, res) => {
	try {
		if (req.session.admin) {
			let hashedPass = await bcrypt.hash(req.body.password, 12)
			await userModel.insertMany([
				{
					userName: req.body.user,
					name: req.body.name,
					password: hashedPass,
					email: req.body.email,
				},
			])
			req.flash("message", "User added")
			return res
				.status(200)
				.send({ result: "redirect", url: "/route/adminPanel" })
		} else res.status(403).render("adminUnauthorized")
	} catch (err) {
		console.log(err.message)
		req.flash("error", "User already exists")
		return res.status(200).send({
			result: "redirect",
			url: "/route/addUser",
		})
	}
})

router.get("/user", async (req, res) => {
	try {
		if (req.session.admin) {
			let user = await userModel.find({ _id: req.query.id })
			res.render("updateUser", { user: user, error: req.flash("error") })
		} else res.status(403).render("adminUnauthorized")
	} catch (err) {
		console.log(err.message)
	}
})

router.put("/user", async (req, res) => {
	try {
		if (req.session.admin) {
			await userModel.updateOne(
				{ _id: req.body._id },
				{
					userName: req.body.user,
					name: req.body.name,
					email: req.body.email,
				}
			)
			req.flash("message", "User Updated")
			return res
				.status(200)
				.send({ result: "redirect", url: "/route/adminPanel" })
		} else res.status(403).render("adminUnauthorized")
	} catch (err) {
		console.log(err.message)
		req.flash("error", "User already exists")
		return res.status(200).send({
			result: "redirect",
			url: `/route/modify/?id=${req.body._id}`,
		})
	}
})

router.delete("/user", async (req, res) => {
	try {
		if (req.session.admin) {
			await userModel.deleteOne({ _id: req.body.userId })
			req.flash("message", "User deleted")
			return res
				.status(200)
				.send({ result: "redirect", url: "/route/adminPanel" })
		} else {
			res.status(403).render("adminUnauthorized")
		}
	} catch (err) {
		console.log(err.message)
	}
})

module.exports = router
