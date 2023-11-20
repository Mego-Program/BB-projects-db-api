const mongoose = require("mongoose");

const password = "juPEpCdGLZ2p8ZmJ"
const uri = "mongodb+srv://projects-api:" + password + "@cluster0.8zlsyqk.mongodb.net/?retryWrites=true&w=majority"

db = mongoose.createConnection(uri)
module.exports = db