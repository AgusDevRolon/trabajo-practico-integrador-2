import User from "../models/user.model";
import { hashPassword, comparePassword } from "../helpers/bcrypt";
import { generateToken } from "../helpers/jwt";

//post /api/auth/register
export const register = async (req, res,)=>{
    try{
        const {username, email, password, profile, role} = req.body;

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user",
            profile
        });

        res.status(201).json({message: "usuario registrado", userId: newUser._id});

    } catch (err) {
        res.status(400).json({message: "error al registrar usuario", error: err.message});
    }
};

//post /api/auth/login

export const login = async (req, res)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(401).json({message: "email o contraseña iconrrectas"});

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) return res.status(401).json({message: "email o contraseña incorrectas"});

        const token = generateToken({userId: user._id, role: user.role});

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000*60*60
        });

        res.json({message: "login exitoso"});
    } catch (err) {
        res.status(500).json({message: "error en login", error: err.message});
    }
    
};

//get /api/auth/profile

export const getProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({message: "usuario no encontrado"});

        res.json({profile: user.profile, username: user.username, email: user.email});
    } catch (err) {
        res.status(500).json({message: "error al obtener perfil", error: err.message});
    }
};

//put /api/auth/profile

export const updateProfile = async (req, res)=>{
    try{
        const updates = req.body.profile;

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({message: "usuario no encontrado"});

        user.profile = {...user.profile.toObject(),...updates};
        await user.save();

        res.json({message: "perfil actualizado", profile: user.profile});
    } catch (err) {
        res.status(500).json({message: "error al actualizar perfil", error:err.message});
    }
};

//post /api/auth/logout

export const logout = (req, res)=>{
    res.clearCookie("token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.json({message: "logout exitoso"});
};