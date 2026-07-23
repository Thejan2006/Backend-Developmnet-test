import express from "express"
import { 
    createOrder, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/orderController.js"

const router = express.Router()

router.post("/", createOrder)
router.get("/:pageNumber/:pageSize", getAllOrders)
router.put("/:orderId", updateOrderStatus)

export default router