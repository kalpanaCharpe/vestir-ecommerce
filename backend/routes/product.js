import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { productValidator } from "../middleware/validators.js";
import validateRequest from "../middleware/validateRequest.js";
import upload from "../middleware/upload.js";

import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", authMiddleware, getProducts);          // Get all products
router.get("/:id", authMiddleware, getProductById);    // Get single product
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);       // Add product
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);     // Update product
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);  // Delete product

export default router;