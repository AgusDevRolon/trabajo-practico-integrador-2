import { verifyToken } from "../helpers/jwt.js";

export const authMiddleware = (req, res, next)=>{
    try{
        const token = req.cookies?.token;

        if (!token) return res.status(401).json({message: "No autorizado"});

        const decoded = verifyToken(token);
        if (!decoded) return res.status(401).json({message: "Token invalido"});

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({message: "No autorizado", error: err.message});
    }
};