import express from "express";
import connectDB from "./dbConnect.js";
import { userController } from "./user/userControls.js";
import { productController } from "./product/productControls.js";
import { cartController } from "./cart/cartController.js";

// backend app
const app = express();

// to make app understand json
app.use(express.json());

// connect database
await connectDB();

// register routes/controller
app.use(userController);
app.use(productController);
app.use(cartController);

// network port
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
