import mongoose from "mongoose";

// set rules/schema/model
const productSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 255 },
  brand: { type: String, trim: true, required: true, maxlength: 255 },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  category: {
    type: String,
    trim: true,
    required: true,
    enum: [
      "grocery",
      "clothing",
      "kids",
      "stationary",
      "kitchen",
      "furniture",
      "electronics",
      "sports",
      "others",
    ],
  },
  image: { type: String, required: false, nullable: true },
  freeShipping: { type: Boolean, required: false, default: false },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 255,
  },
  //   sellerId: mongoose.ObjectId,
  sellerId: {
    type: mongoose.ObjectId,
    ref: "user",
    required: true,
  },
});

// create table
const productTable = mongoose.model("product", productSchema);

export default productTable;
