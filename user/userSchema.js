import mongoose from "mongoose";

// set schema/rules/structure
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
    lowercase:true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  dob: {
    type: Date,
    max: Date.now(),
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: ["male", "female", "others"],
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["seller", "buyer"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
});

// create table/model/collection
const userTable = mongoose.model("user", userSchema);

export default userTable;
