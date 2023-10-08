const path = require("node:path")

// Adding the 'dotenv' import in the server.js file, will make sure
//  it isn't needed to be added again in any other files of the app
require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const mongoose = require("mongoose")

const corsOptions = require("./config/corsOptions")
const { connectDB } = require("./config/dbConn")
const { errorHandler } = require("./middlewares/errorHandler")
const { logger, logEvents } = require("./middlewares/logger")

const app = express()

const PORT = process.env.PORT || 3500

connectDB()

// === === === === === === === === === === === === === === === === ===
// === === === === === === === MIDDLEWARES === === === === === === ===
// === === === === === === === === === === === === === === === === ===

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(logger)

app.use("/", express.static(path.join(__dirname, "public")))

// === === === === === === === === === === === === === === === === ===

app.use("/", require("./routes/root"))
app.use("/users", require("./routes/userRoutes"))

app.all("*", (req, res) => {
	res.status(404)
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"))
	} else if (req.accepts("json")) {
		// If this request was made from an API tester app, like Postman,
		//  then it would need the JSON response.
		res.json({
			message: "404 Not found!",
		})
	} else {
		res.type("txt").send("404 Not Found")
	}
})

app.use(errorHandler)

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB")
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
})

mongoose.connection.on("error", (error) => {
	console.error(error)
	logEvents(
		`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
		"mongoErrorLog.log",
	)
})
