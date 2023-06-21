import express from "express";
import {
  getCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  deleteQuantity,
} from "../controller/cart.controller";

const router = express.Router();

router.get("/getCartItems/:user_ID", getCartItems);
router.post("/addToCart", addToCart);
router.patch("/updateQuantity/:cart_id", updateQuantity);
router.delete("/deleteCartItem/:cart_id", removeFromCart);

router.delete("/deleteCartQuantity/:cart_id", deleteQuantity);

export default router;
