import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
  },

  productId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "product",
  },
  orderedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const CartTable = mongoose.model("cart", cartSchema);

export default CartTable;
