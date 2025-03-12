import CartTable from "./cartSchema.js";

export const isOwnerOfCart = async (req, res, next) => {
  const cartId = req.params.id;
  const cartProduct = await CartTable.findOne({ _id: cartId });

  if (!cartProduct) {
    return res.status(400).send({ message: "This cart doesn't exist" });
  }

  const userId = req.loggedInUserId;
  const isProductInTheUserCart = cartProduct.buyerId.equals(userId);
  if (!isProductInTheUserCart) {
    return res
      .status(400)
      .send({ message: "You are not the owner of this item in cart" });
  }

  next();
};
