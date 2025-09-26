import {model, Schema, Types} from "mongoose";

const CommentSchema = new Schema({
    content: {type: String, minlength: 5, maxlength: 500},
    author: {type: Types.ObjectId, ref: "User"},
    article: {type: Types.ObjectId, ref: "Article"},
    deletedAt: {type: Date, default: null}
}, {timestamps: true});

export default model("Comment", CommentSchema);
