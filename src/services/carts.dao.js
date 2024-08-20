import mongoose from "mongoose";
import cartsModel from "../models/carts.models.js";

class CartService {
  constructor() {
    this.carts = cartsModel;
  }

  get = async () => {
    return await this.carts.find().lean();
  };

  add = async (newData, productId) => {
    const productToAdd = await product.findById(productId);
    await this.carts.create({ user: newData.user, products: [productToAdd] });
    console.log(productToAdd);
  };

  getById = async (id) => {
    return await this.carts.findById(id)
  };

  updateFormat = async (id) => {
    try {
      const findCart = await this.carts.find({ _id: id }).lean();

      if (!findCart) {
        throw new Error(`El carrito con ID ${id} no existe`);
      }

      return findCart;
    } catch (err) {
      return err.message;
    }
  };
  updateCartQuantity = async (cartId, productId, newQuantity) => {
    try {
      const cartObjectId = mongoose.Types.ObjectId(cartId);
      const productObjectId = mongoose.Types.ObjectId(productId);

      const findCart = await this.carts
        .findOneAndUpdate(
          { _id: cartObjectId, "products._id._id": productObjectId },
          { $set: { "products.$.quantity": newQuantity } },
          { new: true }
        )
        .lean();

      if (!findCart) {
        throw new Error(
          `El carrito con ID ${cartId}, ó, el producto con ID ${productId} no existe`
        );
      }

      return findCart;
    } catch (err) {
      return err.message;
    }
  };

  deleteOne = async (cid, pid) => {
    try {
      const updateCart = await this.carts.findByIdAndUpdate(
        cid,
        { $pull: { products: { _id: pid } } },
        { new: true }
      );

      return updateCart;
    } catch (err) {
      return err.message;
    }
  };

  deleteAll = async (cid) => {
    try {
      return await this.carts.findByIdAndUpdate(
        cid,
        { $set: { products: [] } },
        { new: true }
      );
    } catch (err) {
      return err.message;
    }
  };
}

export default CartService;
