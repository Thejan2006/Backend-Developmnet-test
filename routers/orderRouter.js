import express from "express";
import { 
    createOrder, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/orderController.js";

import authenticate from "../middlewares/authenticate.js"; 

const router = express.Router();


router.post("/", authenticate, createOrder);


router.get("/:pageNumber/:pageSize", authenticate, getAllOrders);


router.put("/:orderId", authenticate, updateOrderStatus);

export default router;