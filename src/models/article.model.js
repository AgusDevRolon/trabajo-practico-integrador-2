import {model, Schema, Types} from "mongoose";

const ArticleSchema = new Schema({
    title: {type: String, minlength: 3, maxlength: 200},
    content: {type: String, minlength: 50},
    excerpt: {type: String, maxlength: 500},
    status: {type: String, enum: ["published", "archived"], default: "published"},
    author: {type: Types.ObjectId, ref: "User"},
    tags: [{type: Types.ObjectId, ref: "Tag"}]
}, {timestamps: true});

export default model("Article", ArticleSchema);