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
    profile: ProfileSchema, //doc embebido
    deletedAt: {type: Date, default: null}
}, {timestamps: true});

//middleware para excluir  los eliminados
function excluideDeleted(next){
    if (!this.getOptions().skipDeleted){
        this.where({deletedAt: null});
    }
    next();
}

UserSchema.pre("find", excluideDeleted);
UserSchema.pre("findOne", excluideDeleted);
UserSchema.pre("findOneAndUpdate", excluideDeleted);

//metodo de soft delete
UserSchema.methods.softDelete = async function (){
    this.deletedAt = new Date();
    return this.save();
};

export default model("User", UserSchema);