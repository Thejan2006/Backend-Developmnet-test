import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import adminMiddleware from "../middleware/admin.middleware.js" // Import karaganna
import { 
    createProduct, 
    getAllProducts, 
    deleteProduct, 
    updateProduct, 
    getProductById, 
    searchProducts 
} from "../controllers/productController.js"

const router = express.Router()

// Public Routes
router.get("/", getAllProducts)
router.get("/search/:query", searchProducts)
router.get("/:productId", getProductById)

// Protected & Admin Only Routes (Ddan admin lata witharai meva wada karanne)
router.post("/", authMiddleware, adminMiddleware, createProduct)         
router.put("/:productId", authMiddleware, adminMiddleware, updateProduct)   
router.delete("/:productId", authMiddleware, adminMiddleware, deleteProduct) 

export default router