import mongoose from "mongoose";

mongoose.pluralize(null);

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: false },
  category: { type: String, required: true },
});

const model = mongoose.model(productsCollection, productsSchema);

export default model;
