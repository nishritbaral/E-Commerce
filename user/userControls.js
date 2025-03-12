import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginCredentialSchema,
  registerCredentialSchema,
} from "./userValidation.js";
import UserTable from "./userSchema.js";
import validateReqBody from "../middleware/validateReqBody.js";

const router = express.Router();

router.post(
  "/user/register",
  validateReqBody(registerCredentialSchema),

  async (req, res) => {
    // extract new user from body
    const newUser = req.body;

    // throw error if user already exists
    const user = await UserTable.findOne({ email: newUser.email });
    if (user) {
      return res.status(400).send({ message: "User Already Exists" });
    }

    // hash password
    // requirement plainPassword/ saltRounds
    const plainPassword = newUser.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // updating the hashed password
    newUser.password = hashedPassword;

    // adding the user to DB
    await UserTable.create(newUser);

    return res.status(200).send({ message: "User Registered Successfully" });
  }
);

router.post(
  "/user/login",
  validateReqBody(loginCredentialSchema),
  async (req, res) => {
    // extract login credentials from the body
    const loginCredentials = req.body;

    // check if the user with provided email exists
    const user = await UserTable.findOne({ email: loginCredentials.email });

    // if not user, throw error
    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }

    // check for required password
    // requirement: plain password, hashed password
    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      plainPassword,
      hashedPassword
    );

    // throw error if password is incorrect
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Incorrect Password" });
    }

    // generate token
    // payload => object inside token
    const payLoad = { email: user.email };
    const secretKey = "nvwieurhvislehfaws";

    const token = jwt.sign(payLoad, secretKey, {
      expiresIn: "7D",
    });

    // remove password before sending to user
    user.password = undefined;

    return res.status(200).send({
      message: "Logged in Successfully",
      accessToken: token,
      userDetails: user,
    });
  }
);

// router.get("/user/show/userdata/:id", (req, res) => {
//   const userId = req.params.id;
//   return res.status(200).send({ message: "User Data:" });
// });

// router.delete("user/delete/:id", async (req, res) => {
//   const userId = req.params.id;
//   const userCheck = await UserTable.findOne({ _id: userId });
//   console.log(userCheck);
//   if (userCheck) {
//     return res.status(400).send({ message: "User Doesn't Exist" });
//   }
//   await UserTable.delete({ _id: userId });
//   return res.status(200).send({ message: "User Deleted Successfully" });
// });

export { router as userController };
