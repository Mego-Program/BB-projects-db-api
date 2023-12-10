import { Schema } from "mongoose";

const commentSchema = new Schema({
    title: String,
    content: String,
    creator: String,
    creationDate: { type: Date, default: Date.now },
});


const taskSchema = new Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    status: { type: Schema.Types.ObjectId, ref: 'Status'},
    users: Array,
    comments: [commentSchema]
});

const boardSchema = new Schema({
    name: String,
    description: String,
    creationDate: { type: Date, default: Date.now },
    isSprint: Boolean,
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