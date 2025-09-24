import {model, Schema} from "mongoose";

const TagSchema = new Schema({
    name: {type: String, unique: true, minlength: 2, maxlength: 30, match: [/^\S+$/, 'El nombre no debe contener espacios'] },
    description: {type: String, maxlength: 200},
}, {timestamps: true});

export default model("Tag", TagSchema);