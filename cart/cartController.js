import express from "express";
import mongoose from "mongoose";
import CartTable from "./cartSchema.js";
import { isBuyer } from "../middleware/authenticationMiddleWare.js";
import { addItemToCartSchema } from "./cartValidation.js";
import validateReqBody from "../middleware/validateReqBody.js";
import productTable from "../product/productSchema.js";
import { validateMongoIdFromReqParams } from "../middleware/validateMongoId.js";
import { isOwnerOfCart } from "./cartMiddleware.js";
import { paginationSchema } from "../shared/paginationSchema.js";

const router = express.Router();

router.post(
  "/cart/item/add",
  isBuyer,
  validateReqBody(addItemToCartSchema),
  (req, res, next) => {
    // extract product id from req.body

    const productId = req.body.productId;
    const isValidMongoId = mongoose.isValidObjectId(productId);

    if (!isValidMongoId) {
      return res(400).send({ message: "Invalid Product ID" });
    }

    next();
  },
  async (req, res) => {
    const productId = req.body.productId;

    const product = await productTable.findOne({ _id: productId });

    if (!product) {
      return res.status(400).send({ message: "Product doesn't exist" });
    }

    const orderedQuantity = req.body.orderedQuantity;

    if (orderedQuantity > product.quantity) {
      return res.status(400).send({
        message: "Ordered Quantity cannot be greater than available QuantityS",
      });
    }
    await CartTable.create({
      buyerId: req.loggedInUserId,
      productId,
      orderedQuantity,
    });

    return res.status(200).send({ message: "Adding items to cart" });
  }
);

router.post(
  "/cart/list",
  isBuyer,
  validateReqBody(paginationSchema),
  async (req, res) => {
    const paginationData = req.body;
    const page = paginationData.page;
    const limit = paginationData.limit;
    const skip = (page - 1) * limit;

    const userId = req.loggedInUserId;

    const cartProducts = await CartTable.findOne({
      buyerId: userId,
    });

    if (!cartProducts) {
      return res.status(400).send({ message: "No products in your cart" });
    }

    const products = await CartTable.aggregate([
      { $match: { buyerId: userId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          orderedQuantity: 1,
          product: {
            Name: { $first: "$productDetail.name" },
            Price: { $first: "$productDetail.price" },
            Image: { $first: "$productDetail.image" },
            Category: { $first: "$productDetail.category" },
            Brand: { $first: "$productDetail.brand" },
          },
        },
      },
    ]);

    const totalItems = await CartTable.find({
      buyerId: userId,
    }).countDocuments();
    const totalPage = Math.ceil(totalItems / limit);

    return res.status(200).send({
      message: "Product List",
      products,
      TotalPage: totalPage,
    });
  }
);

//? delete item from cart by using cart id
router.delete(
  "/cart/delete/:id",
  isBuyer,
  validateMongoIdFromReqParams,
  isOwnerOfCart,
  async (req, res) => {
    const cartId = req.params.id;
    await CartTable.deleteOne({ _id: cartId });
    return res.status(200).send({ message: "Product deleted successfully" });
  }
);

//? flush cart (delete all items from cart)

router.delete("/cart/flush", isBuyer, async (req, res) => {
  const userId = req.loggedInUserId;
  const product = await CartTable.findOne({ buyerId: userId });
  if (!product) {
    return res.status(400).send({ message: "No products in your cart" });
  }
  await CartTable.deleteMany({ buyerId: userId });
  return res.status(200).send({ message: "Cart flushed successfully" });
});

//? edit the quantity in cart
router.put(
  "cart/edit/:id",
  isBuyer,
  validateMongoIdFromReqParams,
  isOwnerOfCart,
  validateReqBody(addItemToCartSchema),
  async (req, res) => {
    const cartId = req.params.id;

    const newValues = req.body;
    await CartTable.updateOne({ _id: cartId }, { $set: { ...newValues } });
    return res.status(200).send({ message: "Cart Successfully edited" });
  }
);

export { router as cartController };
