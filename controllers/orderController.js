import Order from "../models/order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

export async function createOrder(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in first." });
        }

        const orderData = {
            orderId: "ORD000001",
            firstName: req.body.firstName || req.user.firstName || req.user.name,
            lastName: req.body.lastName || req.user.lastName || "",
            email: req.user.email,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2 || "",
            city: req.body.city,
            phone: req.body.phone,
            items: [],
            totalAmount: 0
        };

        const lastOrder = await Order.findOne().sort({ _id: -1 });
        if (lastOrder && lastOrder.orderId) {
            const lastOrderId = lastOrder.orderId;
            const lastOrderNumberInString = lastOrderId.replace("ORD", "");
            const lastOrderNumber = parseInt(lastOrderNumberInString);
            const newOrderNumber = lastOrderNumber + 1;
            const newOrderNumberInString = newOrderNumber.toString().padStart(6, "0");
            orderData.orderId = "ORD" + newOrderNumberInString;
        }

        for (let i = 0; i < req.body.items.length; i++) {
            const item = req.body.items[i];
            const itemQty = item.quantity || item.qty || 1; // quantity හෝ qty දෙකම handle කරයි
            
            const product = await Product.findOne({ productId: item.productId || item.product?.productId });

            if (!product) {
                return res.status(400).json({ message: `Product with id ${item.productId} not found` });
            }
            if (product.isAvailable === false) {
                return res.status(400).json({ message: `Product ${product.name} is not available` });
            }

            // Order Schema එකට ගැලපෙන පරිදි 'qty' ලෙස save කිරීම
            orderData.items.push({
                product: {
                    productId: product.productId,
                    name: product.name,
                    image: (product.images && product.images.length > 0) ? product.images[0] : product.image,
                    price: product.price,
                    labelledPrice: product.labelledPrice || product.price
                },
                qty: itemQty
            });

            orderData.totalAmount += product.price * itemQty;
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        res.json({ message: "Order created successfully", orderId: newOrder.orderId });

    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(500).json({ message: err.message });
    }
}

export async function getAllOrders(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // User Model eke role: "admin" saha isAdmin true yana dekama check kirima
        const isAdmin = req.user.role === "admin" || req.user.isAdmin === true;

        const pageSize = parseInt(req.params.pageSize || "10");
        const pageNumber = parseInt(req.params.pageNumber || "1");

        if (isAdmin) {
            const orderCount = await Order.countDocuments();
            const totalPages = Math.ceil(orderCount / pageSize) || 1;
            const orders = await Order.find()
                .sort({ date: -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            return res.json({
                orders: orders,
                totalPages: totalPages,
                totalOrders: orderCount
            });
        } else {
            const orderCount = await Order.countDocuments({ email: req.user.email });
            const totalPages = Math.ceil(orderCount / pageSize) || 1;
            const orders = await Order.find({ email: req.user.email })
                .sort({ date: -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            return res.json({
                orders: orders,
                totalPages: totalPages,
                currentPage: pageNumber,
                totalOrders: orderCount
            });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updateOrderStatus(req, res) {
    const isAdmin = req.user && (req.user.role === "admin" || req.user.isAdmin === true);
    
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized. Admin access required." });
    }

    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await Order.updateOne(
            { orderId: req.params.orderId },
            { status: req.body.status }
        );
        res.json({ message: "Order status updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}