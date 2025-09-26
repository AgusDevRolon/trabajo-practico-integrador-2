import {model, Schema} from "mongoose";
import Article from "./article.model";


const TagSchema = new Schema({
    name: {type: String, unique: true, minlength: 2, maxlength: 30, match: [/^\S+$/, 'El nombre no debe contener espacios'] },
    description: {type: String, maxlength: 200},
    deletedAt: {type: Date, default: null}
}, {timestamps: true});

TagSchema.methods.softDelete = async function () {
    this.deletedAt = new Date();
    await this.save();

    await Article.updateMany(
        { tags: this._id},
        {$pull: {tags: this._id}}//lo saca del array
    );
    return this;
    
};

export default model("Tag", TagSchema);