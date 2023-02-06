const mongoose = require("mongoose")
require("dotenv").config()
mongoose.set("strictQuery", true)

const connections = mongoose.connect(process.env.mongo_url)

console.log("connected successfully")

module.exports = {
    connections
}