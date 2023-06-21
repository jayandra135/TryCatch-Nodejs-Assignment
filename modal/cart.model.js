import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    requred: true,
  },
  productID: {
    type: Schema.Types.ObjectId,
    requred: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Cart", CartSchema);
