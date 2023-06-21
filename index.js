import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import UserRouter from "./router/user.router";
import CategoryRouter from "./router/category.router";
import SubCategoryRouter from "./router/subCategory.router";
import ProductRouter from "./router/product.router";
import CartRouter from "./router/cart.router";
import OrderRouter from "./router/order.router";

var app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());

app.listen(PORT, () => {
  console.log("Your server running on http://localhost:" + PORT);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/" + process.env.DB_NAME)
  .then(() => console.log("Connected!"));

app.use("/user", UserRouter);
app.use("/category", CategoryRouter);
app.use("/subcategory", SubCategoryRouter);
app.use("/product", ProductRouter);
app.use("/cart", CartRouter);
app.use("/order", OrderRouter);
