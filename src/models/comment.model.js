import {model, Schema, Types} from "mongoose";

const CommentSchema = new Schema({
    content: {type: String, minlength: 5, maxlength: 500},
    author: {type: Types.ObjectId, ref: "User"},
    article: {type: Types.ObjectId, ref: "Article"}
}, {timestamps: true});

export default model("Comment", CommentSchema);
