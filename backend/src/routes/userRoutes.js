const express = require("express")
const router = express.Router()
const {
	createNewUser,
	deleteUser,
	getAllUsers,
	updateUser,
} = require("../controllers/usersController")

router
	.route("/")
	.get(getAllUsers)
	.post(createNewUser)
	.patch(updateUser)
	.delete(deleteUser)

module.exports = router
