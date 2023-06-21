import OrderModel from "../modal/order.model";
import ProductModel from "../modal/product.model";
import CartModel from "../modal/cart.model";

export const getOrderDetails = async (req, res) => {
  try {
    const userID = req.params.user_ID;
    const orderData = await OrderModel.findOne({ userID: userID });

    if (orderData) {
      return res.status(200).json({
        data: orderData,
        message: "Cart Items",
        result: orderData.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addOrder = async (req, res) => {
  try {
    const { userid, cartid } = req.body;

    const cartData = await CartModel.findOne({ _id: cartid });

    const orderData = new OrderModel({
      userID: userid,
      productID: cartData.productID,
      price: cartData.price,
      quantity: cartData.quantity,
      thumbnail: cartData.thumbnail,
    });
    orderData.save();
    if (orderData) {
      return res.status(201).json({
        data: orderData,
        message: "Successfully added",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
