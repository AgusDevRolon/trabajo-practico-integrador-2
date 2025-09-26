import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

export const generateToken = (payload, expireIn = "1h")=>{
    return jwt.sign(payload, SECRET_KEY, {expiresIn});
};

export const verifyToken = (token)=>{
    try{
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};