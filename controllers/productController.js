import Product from "../models/product.js"

export async function createProduct(req, res) {
    if (req.user == null) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    // FIX: role === "admin" kiyala check karanna
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Only admins can create products" })
    }

    try {
        const existingProduct = await Product.findOne({ productId: req.body.productId })

        if (existingProduct != null) {
            return res.status(400).json({ success: false, message: "Product with this productId already exists" })
        }

        const product = new Product(req.body)
        await product.save()

        return res.status(201).json({ success: true, message: "Product created successfully", data: product })

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

export async function getAllProducts(req, res) {
    console.log("Products are fetching.....")
    try {
        if (req.user != null && req.user.role === "admin") {
            const products = await Product.find()
            return res.json({ success: true, data: products })
        } else {
            const products = await Product.find({ isAvailable: true })
            return res.json({ success: true, data: products })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

export async function deleteProduct(req, res) {
    if (req.user != null && req.user.role === "admin") {
        try {
            const product = await Product.findOne({ productId: req.params.productId })
            if (product == null) {
                return res.status(404).json({ success: false, message: "Product not found" })
            }

            await Product.deleteOne({ productId: req.params.productId })
            return res.json({ success: true, message: "Product deleted successfully" })

        } catch (err) {
            return res.status(500).json({ success: false, message: err.message })
        }
    } else {
        return res.status(403).json({ success: false, message: "Only admins can delete products" })
    }
}

export async function updateProduct(req, res) {
    if (req.user != null && req.user.role === "admin") {
        try {
            if (req.body.productId != null) {
                return res.status(400).json({ success: false, message: "productId cannot be updated" })
            }

            await Product.updateOne({ productId: req.params.productId }, req.body)
            return res.json({ success: true, message: "Product updated successfully" })

        } catch (err) {
            return res.status(500).json({ success: false, message: err.message })
        }
    } else {
        return res.status(403).json({ success: false, message: "Only admins can update products" })
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findOne({ productId: req.params.productId })

        if (product == null) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        if (product.isAvailable) {
            return res.json({ success: true, data: product })
        } else {
            if (req.user != null && req.user.role === "admin") {
                return res.json({ success: true, data: product })
            } else {
                return res.status(403).json({ success: false, message: "Only admins can view unavailable products" })
            }
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

export async function searchProducts(req, res) {
    try {
        const query = req.params.query
        const products = await Product.find(
            {
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                    { altNames: { $elemMatch: { $regex: query, $options: "i" } } }
                ],
                isAvailable: true
            }
        )
        return res.json({ success: true, data: products })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}