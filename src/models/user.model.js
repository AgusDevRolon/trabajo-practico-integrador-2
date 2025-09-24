import {model, Schema} from "mongoose";

const ProfileSchema = new Schema({
    firstName: {type: String, minlength: 2, maxlength: 50},
    lastName: {type: String, minlength: 2, maxlength: 50},
    biography: {type: String, maxlength: 500},
    avatarUrl: {type: String},
    birthDate: {type: Date}
});

const UserSchema = new Schema({
    username: {type: String, unique: true, minlength: 3, maxlength: 20},
    email: {type: String, unique: true},
    password: {type: String},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    profile: ProfileSchema //doc embebido
}, {timestamps: true});


export default model("User", UserSchema);