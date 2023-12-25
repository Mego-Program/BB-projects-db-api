import { Schema } from "mongoose";

const commentSchema = new Schema({
    title: {type: String, defult: "Untitled"},
    content: {type: String, required: true },
    creator: {type: String, required: true },
    creationDate: { type: Date, default: Date.now },
});


const taskSchema = new Schema({
    name: {type: String, required: true },
    description: String,
    creationDate: { type: Date, default: Date.now },
    status: { type: Schema.Types.ObjectId, ref: 'Status'},
    user: String,
    comments: [commentSchema]
});

const boardSchema = new Schema({
    name: {type: String, required: true },
    description: String,
    creationDate: { type: Date, default: Date.now },
    isSprint: {type: Boolean, default: true},
    endDate: Date,
    users: Array,
    tasks: [taskSchema],
    comments: [commentSchema]
});


const statusSchema = new Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    precedence: Number,
});



export default {
    boardSchema,
    taskSchema,
    statusSchema,
    commentSchema
};