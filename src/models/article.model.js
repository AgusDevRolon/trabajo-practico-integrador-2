import {model, Schema, Types} from "mongoose";
import Comment from "./comment.model";

const ArticleSchema = new Schema({
    title: {type: String, minlength: 3, maxlength: 200},
    content: {type: String, minlength: 50},
    excerpt: {type: String, maxlength: 500},
    status: {type: String, enum: ["published", "archived"], default: "published"},
    author: {type: Types.ObjectId, ref: "User"},
    tags: [{type: Types.ObjectId, ref: "Tag"}],
    deletedAt: {type: Date, default: null}
}, {timestamps: true});

//soft delete en cascada, elimina tambien los comentarios
ArticleSchema.methods.softDelete = async function () {
    this.deletedAt = new Date();
    await this.save();

    await Comment.updateMany(
        {articleId: this._id, deletedAt: null},
        {$set: {deletedAt: new Date()}}
    );

    return this;
    
};

export default model("Article", ArticleSchema);