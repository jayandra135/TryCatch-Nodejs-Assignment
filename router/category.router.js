import express from "express";
import {
  getAllCategory,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller";

const router = express.Router();

router.get("/get-categoryAll", getAllCategory);

router.get("/get-singleCategory/:category_id", getCategory);

router.post("/addCategory", addCategory);

router.delete("/deleteCategory/:category_id", deleteCategory);
router.put("/updateCategory/:category_id", updateCategory);
export default router;
