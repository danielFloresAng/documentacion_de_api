import mongoose from "mongoose";

import usersModels from "./users.models.js";
import productsModel from "./products.models.js";

mongoose.pluralize(null);
const collection = "carts";

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user_index",
  },
  products: {
    type: [{ _id: mongoose.Schema.Types.ObjectId, quantity: Number }],
    required: true,
    ref: "products",
  },
});

schema.pre("find", function () {
  this.populate({ path: "user", model: usersModels });
  this.populate({ path: "products._id", model: productsModel });
});
const model = mongoose.model(collection, schema);
export default model;
