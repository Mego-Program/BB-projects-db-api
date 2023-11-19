const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    users: Array,
    statuses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Status' }]
});

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status'},
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
    users: Array
});

const statusSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
});

module.exports = {
    boardSchema,
    taskSchema,
    statusSchema
};