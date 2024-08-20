import mongoose, { Mongoose, Schema } from "mongoose";
import cartsModel from "./carts.models.js";

mongoose.pluralize(null);

const collection = "user_index";

const schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true, index: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "premium", "user"], default: "user" },
  cart: { type: { _id: mongoose.Schema.Types.ObjectId }, ref: "carts" },
});

schema.pre("find", function () {
  this.populate({ path: "", model: cartsModel });
});
const model = mongoose.model(collection, schema);

export default model;
