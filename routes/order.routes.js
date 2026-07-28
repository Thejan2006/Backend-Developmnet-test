import express from "express"
import { 
    createOrder, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router()

// 1. Order එකක් Place කිරීම (User Protected)
router.post("/", authMiddleware, createOrder);

// 2. සියලුම Orders ලබාගැනීම (User / Admin Protected)
router.get("/:pageNumber/:pageSize", authMiddleware, getAllOrders);

// 3. Order Status එක Update කිරීම (Admin Protected)
router.put("/:orderId", authMiddleware, updateOrderStatus);

export default router;