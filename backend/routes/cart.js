import express from "express";
import { addToCart, removeFromCart, getCart, updateCartItem, clearCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);         // Add product to cart
router.delete("/remove", authMiddleware, removeFromCart); // Remove product from cart
router.get("/", authMiddleware, getCart);               // Get cart for a user
router.put("/update", authMiddleware, updateCartItem);  // Update quantity of a product
router.delete("/clear", authMiddleware, clearCart);     // Clear all items


export default router;