import express from "express";
import {
  getAllProduct,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller";

import auth from "../middleware/auth.middleware";

const router = express.Router();

router.get("/get-allProducts", auth, getAllProduct);

router.get("/get-singleProduct/:product_id", auth, getProduct);

router.post("/addProduct", auth, addProduct);

router.delete("/deleteProduct/:product_id", auth, deleteProduct);
router.put("/updateProduct/:product_id", auth, updateProduct);
export default router;
