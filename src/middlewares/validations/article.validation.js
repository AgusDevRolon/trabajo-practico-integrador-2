import { body, param, query } from "express-validator";
import Article from "../models/article.model.js";
import User from "../models/user.model.js";
import Tag from "../models/tag.model.js";

// validaciones para crear artículo
export const createArticleValidation = [
    body("title")
        .notEmpty().withMessage("El título es obligatorio")
        .isLength({ min: 3, max: 200 }).withMessage("El título debe tener entre 3 y 200 caracteres")
        .custom(async (title, { req }) => {
            if (req.body.author) {
                const existingArticle = await Article.findOne({
                    title: { $regex: new RegExp(`^${title}$`, "i") },
                    author: req.body.author
                });
                if (existingArticle) {
                    throw new Error("Ya existe un artículo con el mismo título para este autor");
                }
            }
            return true;
        }),

    body("content")
        .notEmpty().withMessage("El contenido es obligatorio")
        .isLength({ min: 50 }).withMessage("El contenido debe tener al menos 50 caracteres"),

    body("excerpt")
        .optional()
        .isLength({ max: 500 }).withMessage("El extracto no puede exceder 500 caracteres"),

    body("status")
        .optional()
        .isIn(["draft", "published", "archived"]).withMessage("El estado debe ser draft, published o archived"),

    body("author")
        .notEmpty().withMessage("El autor es obligatorio")
        .isMongoId().withMessage("ID de autor inválido")
        .custom(async (authorId) => {
            const author = await User.findById(authorId);
            if (!author) {
                throw new Error("El autor no existe");
            }
            return true;
        }),

    body("tags")
        .optional()
        .isArray().withMessage("Los tags deben ser un array")
        .custom((tags) => {
            if (tags.length > 10) {
                throw new Error("No se pueden asignar más de 10 tags");
            }
            return true;
        })
        .custom((tags) => {
            const invalidIds = tags.filter(id => !mongoose.Types.ObjectId.isValid(id));
            if (invalidIds.length > 0) {
                throw new Error("Uno o más IDs de tags son inválidos");
            }
            return true;
        })
        .custom(async (tags) => {
            if (tags && tags.length > 0) {
                const existingTags = await Tag.find({ _id: { $in: tags } });
                if (existingTags.length !== tags.length) {
                    throw new Error("Uno o más tags no existen");
                }
            }
            return true;
        })
];

// validaciones para actualizar artículo
export const updateArticleValidation = [
    param("id")
        .isMongoId().withMessage("ID de artículo inválido")
        .custom(async (id) => {
            const article = await Article.findById(id);
            if (!article) {
                throw new Error("El artículo no existe");
            }
            return true;
        }),

    body("title")
        .optional()
        .isLength({ min: 3, max: 200 }).withMessage("El título debe tener entre 3 y 200 caracteres")
        .custom(async (title, { req }) => {
            const article = await Article.findById(req.params.id);
            if (title && article) {
                const existingArticle = await Article.findOne({
                    title: { $regex: new RegExp(`^${title}$`, "i") },
                    author: article.author,
                    _id: { $ne: req.params.id }
                });
                if (existingArticle) {
                    throw new Error("Ya existe un artículo con el mismo título para este autor");
                }
            }
            return true;
        }),

    body("content")
        .optional()
        .isLength({ min: 50 }).withMessage("El contenido debe tener al menos 50 caracteres"),

    body("excerpt")
        .optional()
        .isLength({ max: 500 }).withMessage("El extracto no puede exceder 500 caracteres"),

    body("status")
        .optional()
        .isIn(["draft", "published", "archived"]).withMessage("El estado debe ser draft, published o archived"),

    body("tags")
        .optional()
        .isArray().withMessage("Los tags deben ser un array")
        .custom((tags) => {
            if (tags.length > 10) {
                throw new Error("No se pueden asignar más de 10 tags");
            }
            return true;
        })
];

// validaciones para listar artículos
export const getArticlesValidation = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("La página debe ser un número mayor a 0"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 }).withMessage("El límite debe ser entre 1 y 50"),

    query("status")
        .optional()
        .isIn(["draft", "published", "archived"]).withMessage("Estado inválido"),

    query("author")
        .optional()
        .isMongoId().withMessage("ID de autor inválido")
];