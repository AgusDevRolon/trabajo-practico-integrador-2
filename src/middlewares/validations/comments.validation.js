import { body, param } from "express-validator";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Article from "../models/article.model.js";

// validaciones para crear comentario
export const createCommentValidation = [
    body("content")
        .notEmpty().withMessage("El contenido del comentario es obligatorio")
        .isLength({ min: 5, max: 500 }).withMessage("El comentario debe tener entre 5 y 500 caracteres"),

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

    body("article")
        .notEmpty().withMessage("El artículo es obligatorio")
        .isMongoId().withMessage("ID de artículo inválido")
        .custom(async (articleId) => {
            const article = await Article.findOne({ 
                _id: articleId, 
                status: "published" 
            });
            if (!article) {
                throw new Error("El artículo no existe o no está publicado");
            }
            return true;
        }),

    body("parentComment")
        .optional()
        .isMongoId().withMessage("ID de comentario padre inválido")
        .custom(async (parentCommentId) => {
            if (parentCommentId) {
                const parentComment = await Comment.findOne({ 
                    _id: parentCommentId, 
                    status: "active" 
                });
                if (!parentComment) {
                    throw new Error("El comentario padre no existe o no está activo");
                }
            }
            return true;
        })
        .custom(async (parentCommentId, { req }) => {
            if (parentCommentId && req.body.article) {
                const parentComment = await Comment.findById(parentCommentId);
                if (parentComment && parentComment.article.toString() !== req.body.article) {
                    throw new Error("El comentario padre debe pertenecer al mismo artículo");
                }
            }
            return true;
        })
];

// validaciones para actualizar comentario
export const updateCommentValidation = [
    param("id")
        .isMongoId().withMessage("ID de comentario inválido")
        .custom(async (id) => {
            const comment = await Comment.findById(id);
            if (!comment) {
                throw new Error("El comentario no existe");
            }
            return true;
        }),

    body("content")
        .optional()
        .isLength({ min: 5, max: 500 }).withMessage("El comentario debe tener entre 5 y 500 caracteres"),

    body("status")
        .optional()
        .isIn(["active", "hidden", "deleted"]).withMessage("El estado debe ser active, hidden o deleted")
];