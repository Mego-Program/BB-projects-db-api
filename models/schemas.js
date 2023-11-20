const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status'},
    users: Array
});

const boardSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    users: Array,
    tasks: [taskSchema]
});


const statusSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    precedence: Number,
});

module.exports = {
    boardSchema,
    taskSchema,
    statusSchema
};