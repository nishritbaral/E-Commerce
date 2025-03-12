import productTable from "./productSchema.js";

export const isOwnerOfProduct = async (req, res, next) => {
  const productId = req.params.id;
  const product = await productTable.findOne({ _id: productId });

  if (!product) {
    return res.status(400).send({ message: "Product Doesn't Exist" });
  }

  const isOwnerOfProduct = product.sellerId?.equals(req.loggedInUserId);

  if (!isOwnerOfProduct) {
    return res
      .status(400)
      .send({ message: "You are not owner of this product" });
  }
  next();
};
