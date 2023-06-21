import CartModel from "../modal/cart.model";
import ProductModel from "../modal/product.model";

export const getCartItems = async (req, res) => {
  try {
    const userID = req.params.user_ID;
    const cartData = await CartModel.findOne({ userID: userID });

    if (cartData) {
      return res.status(200).json({
        data: cartData,
        message: "Cart Items",
        result: cartData.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userid, productid } = req.body;

    const productData = await ProductModel.findOne({ _id: productid });

    const existCartItem = await CartModel.findOne({
      productID: productid,
      userID: userid,
    });

    if (existCartItem) {
      let quantity = existCartItem.quantity + 1;
      let price = productData.price * quantity;
      console.log(quantity, "quan");
      let updatedItem = await CartModel.updateOne(
        {
          _id: existCartItem._id,
        },
        {
          $set: {
            quantity: quantity,
            price: price,
          },
        }
      );

      if (updatedItem.acknowledged) {
        return res.status(200).json({
          message: "updated",
        });
      }
    }

    const cartData = new CartModel({
      userID: userid,
      productID: productid,
      name: productData.name,
      price: productData.price,
      quantity: 1,
      thumbnail: productData.thumbnail,
    });
    cartData.save();
    if (cartData) {
      return res.status(201).json({
        data: cartData,
        message: "Successfully added",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cartId = req.params.cart_id;

    let removeCart = await CartModel.deleteOne({ _id: cartId });

    if (removeCart.acknowledged) {
      return res.status(200).json({
        data: removeCart,
        message: "deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const cartID = req.params.cart_id;
    const { productid } = req.body;
    const { updatetype } = req.query;

    const cartData = await CartModel.findOne({ _id: cartID });
    const productData = await ProductModel.findOne({ _id: productid });

    let quantity = cartData.quantity;
    let price = productData.price;

    if (updatetype === "increment") {
      quantity += 1;
      price = price * quantity;
    }
    if (updatetype === "decrement") {
      quantity -= 1;
      price = price * quantity;
    }

    const updatedQuantity = await CartModel.updateOne(
      { _id: cartID },
      {
        $set: {
          quantity: quantity,
          price: price,
        },
      }
    );
    if (updatedQuantity.acknowledged) {
      return res.status(200).json({
        message: "Updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteQuantity = async (req, res) => {
  try {
    const cartId = req.params.cart_id;

    const cartData = await CartModel.findOne({ _id: cartId });

    let quantity = cartData.quantity <= 0;
    let highQuantity = cartData.quantity >= 10;
    let deleteQuantity = "";

    if (quantity) {
      deleteQuantity = await CartModel.deleteOne({ _id: cartId });
    }

    if (highQuantity) {
      return res.status(200).json({
        message: "more than",
      });
    }
    if (deleteQuantity.acknowledged) {
      return res.status(200).json({
        data: deleteQuantity,
        message: "deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
