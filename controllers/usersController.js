const Note = require("../models/Note")
const User = require("../models/User")

const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (_req, res) => {
	// Here '-password' means there is no need to send the password in the result
	const users = await User.find().select("-password").lean()
	if (!users) {
		return res.status(400).json({
			message: "No users found!",
		})
	}
	res.json(users)
})

// @desc Create a new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body

	// Confirm if all data are provided by the user
	if (!username || !password || !Array.isArray(roles) || !roles.length) {
		return res.status(400).json({
			message: "All fields are required",
		})
	}

	// Check if there is any existing user with the same username
	const duplicate = await User.findOne({ username }).lean().exec()

	if (duplicate) {
		return res.status(409).json({
			message: "Duplicate username",
		})
	}

	// Hash password
	const hashedPwd = await bcrypt.hash(password, 10) // 10 here is the salt rounds

	const userObject = { username, password: hashedPwd, roles }
	const user = await User.create(userObject)
	if (user) {
		res.status(201).json({
			message: `New user ${username} created successfully!`,
		})
	} else {
		res.status(400).json({
			message: "Invalid user data received",
		})
	}
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password } = req.body

	// Confirm the data provided in the request
	if (
		!id ||
		!username ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== "boolean"
	) {
		return res.status(400).json({
			message: "All fields are required",
		})
	}

	const user = await User.findById(id).exec()

	if (!user) {
		return res.status(400).json({ message: "User not found" })
	}

	const duplicate = await User.findOne({ username }).lean().exec()

	// Allow updates to the original user only. So check the ID field
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({
			message: "Duplicate username",
		})
	}
	user.username = username
	user.active = active
	user.roles = roles

	// Hash the password, if there is a new password (to update)
	if (password) {
		user.password = await bcrypt.hash(password, 10)
	}

	const updatedUser = await user.save()

	res.json({
		message: `${updatedUser.username} updated`,
	})
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body

	if (!id) {
		return res.status(400).json({
			message: "User ID is required",
		})
	}

	const notes = await Note.findOne({ user: id }).lean().exec()
	if (notes?.length) {
		return res.status(400).json({
			message: "Can't delete user since they have assigned notes.",
		})
	}

	const user = await User.findById(id).exec()

	if (!user) {
		return res.status.apply(400).json({
			message: "User not found",
		})
	}

	const result = await user.deleteOne()

	res.json({
		message: `User ${result.username} with id = ${result._id} deleted successfully!`,
	})
})

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
}
