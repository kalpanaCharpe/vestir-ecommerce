import { body } from "express-validator";

export const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

export const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

export const updateProfileValidator = [
    body("name")
        .optional()
        .notEmpty()
        .withMessage("Name cannot be empty"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Valid email is required"),
    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

export const productValidator = [
    body("name")
        .notEmpty()
        .withMessage("Product name is required"),
    body("price")
        .isNumeric()
        .withMessage("Price must be a number"),
    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
];