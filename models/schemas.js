const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    title: String,
    content: String,
    creator: String,
    creationDate: { type: Date, default: Date.now },
});


const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status'},
    users: Array,
    comments: [commentSchema]
});

const boardSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    isSprint: Boolean,
    endDate: Date,
    users: Array,
    tasks: [taskSchema],
    comments: [commentSchema]
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
    statusSchema,
    commentSchema
};