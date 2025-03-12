import express from "express";
import productTable from "./productSchema.js";
import { productSchema } from "./productValidation.js";
import {
  isUser,
  isBuyer,
  isSeller,
} from "../middleware/authenticationMiddleWare.js";
import { validateMongoIdFromReqParams } from "../middleware/validateMongoId.js";
import validateReqBody from "../middleware/validateReqBody.js";
import { paginationSchema } from "../shared/paginationSchema.js";
import { isOwnerOfProduct } from "./productMiddleware.js";

const router = express.Router();

//? add product
router.post(
  "/product/add",
  isSeller,
  validateReqBody(productSchema),
  async (req, res) => {
    const newProduct = req.body;
    const sellerId = req.loggedInUserId;

    await productTable.create({ ...newProduct, sellerId });

    return res.status(200).send({ message: "Product Added" });
  }
);

//? list products by buyer
router.post(
  "/product/buyer/list",
  isBuyer,
  validateReqBody(paginationSchema),
  async (req, res) => {
    const paginationData = req.body;

    const limit = paginationData.limit;
    const page = paginationData.page;

    const skip = (page - 1) * limit;

    const products = await productTable.aggregate([
      {
        $match: {},
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    const totalItems = await productTable.find().countDocuments();
    const totalPage = Math.ceil(totalItems / limit);
    return res.status(200).send({
      message: "Product List",
      Products: products,
      TotalPage: totalPage,
    });
  }
);

//? list products by seller
router.post(
  "/product/seller/list",
  isSeller,
  validateReqBody(paginationSchema),
  async (req, res) => {
    const paginationData = req.body;

    const page = paginationData.page;
    const limit = paginationData.limit;

    const skip = (page - 1) * limit;

    const products = await productTable.aggregate([
      {
        $match: {
          sellerId: req.loggedInUserId,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    if (!products) {
      return res.status(400).send({ message: "No products" });
    }
    const totalItems = await productTable
      .find({
        sellerId: req.loggedInUserId,
      })
      .countDocuments();

    const totalPage = Math.ceil(totalItems / limit);

    return res.status(200).send({
      message: "Product List",
      Products: products,
      TotalPage: totalPage,
    });
  }
);

//? get product details
router.get(
  "/product/details/:id",
  isUser,
  validateMongoIdFromReqParams,
  async (req, res) => {
    const productId = req.params.id;

    const product = await productTable.findOne({ _id: productId });
    if (!product) {
      return res.status(400).send({ message: "Product doesn't Exist" });
    }
    return res.status(200).send({ message: "Product Detail: ", product });
  }
);

//? delete product by id
router.delete(
  "/product/delete/:id",
  isSeller,
  validateMongoIdFromReqParams,
  isOwnerOfProduct,

  async () => {
    const productId = req.params.id;

    await productTable.deleteOne({ _id: productId });

    return res.status(200).send({ message: "Product Deleted" });
  }
);

router.put(
  "/product/edit/:id",
  isSeller,
  validateMongoIdFromReqParams,
  isOwnerOfProduct,
  validateReqBody(productSchema),
  async (req, res) => {
    // extract id
    const productId = req.params.id;

    // extract new values
    const newValues = req.body;

    await productTable.updateOne(
      {
        _id: productId,
      },
      {
        $set: {
          ...newValues,
        },
      }
    );

    return res.status(200).send({ message: "Product Edited Successfully" });
  }
);
export { router as productController };
