import { body, param } from "express-validator";
import Tag from "../models/tag.model.js";

// validaciones para crear tag
export const createTagValidation = [
    body("name")
        .notEmpty().withMessage("El nombre del tag es obligatorio")
        .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres")
        .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+$/).withMessage("El nombre solo puede contener letras, números, guiones y guiones bajos")
        .custom(async (name) => {
            const existingTag = await Tag.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, "i") } 
            });
            if (existingTag) {
                throw new Error("El nombre del tag ya existe");
            }
            return true;
        })
        .custom((name) => {
            if (/\s/.test(name)) {
                throw new Error("El nombre del tag no puede contener espacios");
            }
            return true;
        }),

    body("description")
        .optional()
        .isLength({ max: 200 }).withMessage("La descripción no puede exceder 200 caracteres")
];

// validaciones para actualizar tag
export const updateTagValidation = [
    param("id")
        .isMongoId().withMessage("ID de tag inválido")
        .custom(async (id) => {
            const tag = await Tag.findById(id);
            if (!tag) {
                throw new Error("El tag no existe");
            }
            return true;
        }),

    body("name")
        .optional()
        .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres")
        .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+$/).withMessage("El nombre solo puede contener letras, números, guiones y guiones bajos")
        .custom(async (name, { req }) => {
            const existingTag = await Tag.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, "i") },
                _id: { $ne: req.params.id }
            });
            if (existingTag) {
                throw new Error("El nombre del tag ya existe");
            }
            return true;
        })
        .custom((name) => {
            if (name && /\s/.test(name)) {
                throw new Error("El nombre del tag no puede contener espacios");
            }
            return true;
        }),

    body("description")
        .optional()
        .isLength({ max: 200 }).withMessage("La descripción no puede exceder 200 caracteres")
];