import { body, param } from "express-validator";
import User from "../models/User.js";
import mongoose from "mongoose";

// validaciones para crear usuario
export const createUserValidation = [
    body("username")
        .notEmpty().withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 3, max: 20 }).withMessage("El usuario debe tener entre 3 y 20 caracteres")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Solo se permiten letras, números y guiones bajos")
        .custom(async (username) => {
            const existingUser = await User.findOne({ 
                username: username.toLowerCase() 
            });
            if (existingUser) {
                throw new Error("El nombre de usuario ya existe");
            }
            return true;
        }),

    body("email")
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("Email inválido")
        .custom(async (email) => {
            const existingUser = await User.findOne({ 
                email: email.toLowerCase() 
            });
            if (existingUser) {
                throw new Error("El email ya está registrado");
            }
            return true;
        }),

    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("La contraseña debe contener mayúscula, minúscula, número y carácter especial (@$!%*?&)"),

    body("role")
        .optional()
        .isIn(["user", "admin"]).withMessage("El rol debe ser 'user' o 'admin'"),

    body("profile.firstName")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("El nombre solo puede contener letras y espacios"),

    body("profile.lastName")
        .notEmpty().withMessage("El apellido es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("El apellido solo puede contener letras y espacios"),

    body("profile.biography")
        .optional()
        .isLength({ max: 500 }).withMessage("La biografía no puede exceder 500 caracteres"),

    body("profile.avatarUrl")
        .optional()
        .isURL().withMessage("La URL del avatar debe ser válida"),

    body("profile.birthDate")
        .optional()
        .isISO8601().withMessage("La fecha de nacimiento debe ser válida")
        .custom((date) => {
            const birthDate = new Date(date);
            const now = new Date();
            const minDate = new Date('1900-01-01');
            
            if (birthDate > now || birthDate < minDate) {
                throw new Error("La fecha de nacimiento debe estar entre 1900 y la fecha actual");
            }
            return true;
        })
];

// validaciones para actualizar usuario
export const updateUserValidation = [
    param("id")
        .isMongoId().withMessage("ID de usuario inválido")
        .custom(async (id) => {
            const user = await User.findById(id);
            if (!user) {
                throw new Error("El usuario no existe");
            }
            return true;
        }),

    body("username")
        .optional()
        .isLength({ min: 3, max: 20 }).withMessage("El usuario debe tener entre 3 y 20 caracteres")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Solo se permiten letras, números y guiones bajos")
        .custom(async (username, { req }) => {
            const existingUser = await User.findOne({ 
                username: username.toLowerCase(),
                _id: { $ne: req.params.id }
            });
            if (existingUser) {
                throw new Error("El nombre de usuario ya existe");
            }
            return true;
        }),

    body("email")
        .optional()
        .isEmail().withMessage("Email inválido")
        .custom(async (email, { req }) => {
            const existingUser = await User.findOne({ 
                email: email.toLowerCase(),
                _id: { $ne: req.params.id }
            });
            if (existingUser) {
                throw new Error("El email ya está registrado");
            }
            return true;
        }),

    body("password")
        .optional()
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("La contraseña debe contener mayúscula, minúscula, número y carácter especial"),

    body("role")
        .optional()
        .isIn(["user", "admin"]).withMessage("El rol debe ser 'user' o 'admin'")
];

// validaciones para login
export const loginValidation = [
    body("email")
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("Email inválido"),

    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
];