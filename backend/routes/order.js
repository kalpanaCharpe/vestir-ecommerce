import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();

router.post("/place", authMiddleware, placeOrder);              // Place order
router.get("/user", authMiddleware, getUserOrders);             // Get user orders
router.delete("/:orderId", authMiddleware, deleteOrder);        // User: delete own order
router.get("/", authMiddleware, adminMiddleware, getAllOrders);                  // Admin: get all orders
router.put("/:orderId", authMiddleware, adminMiddleware, updateOrderStatus);     // Admin: update order status

export default router;