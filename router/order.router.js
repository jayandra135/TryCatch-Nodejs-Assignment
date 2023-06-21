import express from "express";
import { getOrderDetails, addOrder } from "../controller/order.controller";

const router = express.Router();

router.get("/getOrderDetails/:user_ID", getOrderDetails);
router.post("/addOrder", addOrder);
// router.patch("/updateQuantity/:cart_id", updateQuantity);
// router.delete("/deleteCartItem/:cart_id", removeFromCart);

// router.delete("/deleteCartQuantity/:cart_id", deleteQuantity);

export default router;
