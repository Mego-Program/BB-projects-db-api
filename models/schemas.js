const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status'},
    users: Array,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

const boardSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    isSprint: Boolean,
    endDate: Date,
    users: Array,
    tasks: [taskSchema],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});


const statusSchema = new mongoose.Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    precedence: Number,
});

const commentSchema = new mongoose.Schema({
    title: String,
    text: String,
    creationDate: { type: Date, default: Date.now },
    rootType: { type: String, enum: ["Task", "Board"] },
    rootId: mongoose.Schema.Types.ObjectId 
});



module.exports = {
    boardSchema,
    taskSchema,
    statusSchema,
    commentSchema
};