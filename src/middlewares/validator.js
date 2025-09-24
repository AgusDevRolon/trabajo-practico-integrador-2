import { validationResult } from "express-validator";

export const validator = (req, res, next) =>{
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "error de validacion",
            errors: result.mapped()
        });
    }

    next();
};