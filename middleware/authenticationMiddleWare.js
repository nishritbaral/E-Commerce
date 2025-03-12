import jwt from "jsonwebtoken";
import UserTable from "../user/userSchema.js";

export const isSeller = async (req, res, next) => {
  // extract token from req.headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // extract payload from token by decryption
  let payLoad = null;

  try {
    const secretKey = "nvwieurhvislehfaws";

    payLoad = jwt.verify(token, secretKey);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // find user using email from payload
  const user = await UserTable.findOne({ email: payLoad.email });

  if (!user) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  if (user.role !== "seller") {
    return res.status(401).send({ message: "Unauthorized." });
  }

  req.loggedInUserId = user._id;

  next();
};

export const isBuyer = async (req, res, next) => {
  // extract token from req.headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // extract payload from token by decryption

  let payload = null;

  try {
    const secretKey = "nvwieurhvislehfaws";

    payload = jwt.verify(token, secretKey);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // find user using email from payload
  const user = await UserTable.findOne({ email: payload.email });

  if (!user) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  if (user.role !== "buyer") {
    return res.status(401).send({ message: "Unauthorized." });
  }

  req.loggedInUserId = user._id;

  next();
};

export const isUser = async (req, res, next) => {
  // extract token from req.headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // extract payload from token by decryption

  let payload = null;

  try {
    const secretKey = "nvwieurhvislehfaws";

    payload = jwt.verify(token, secretKey);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // find user using email from payload
  const user = await UserTable.findOne({ email: payload.email });

  if (!user) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  req.loggedInUserId = user._id;

  next();
};
