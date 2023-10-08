const path = require("node:path")
const express = require("express")

const app = express()

const PORT = process.env.PORT || 3500

app.use("/", express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/root"))

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

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
