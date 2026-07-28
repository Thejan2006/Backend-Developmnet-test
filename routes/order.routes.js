import express from "express"
import { 
    createOrder, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router()


router.post("/", authMiddleware, createOrder);


router.get("/:pageNumber/:pageSize", authMiddleware, getAllOrders);


router.put("/:orderId", authMiddleware, updateOrderStatus);

export default router;