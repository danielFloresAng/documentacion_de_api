import CartService from '../services/carts.dao.js'

const service = new CartService();

class cartManagerMdb {
  constructor() {}

  getAllCarts = async () => {
    try {
      return await service.get();
    } catch (error) {
      return error.message;
    }
  };

  addCart = async (newData, productId) => {
    try {
      return await service.add(newData, productId);
    } catch (error) {
      return error.message;
    }
  };

  getCartById = async (id) => {
    try {
      return await service.getById(id);
    } catch (error) {
      return error.message;
    }
  };

  updateCartFormat = async (id) => {
    try {
      return await service.updateFormat(id);
    } catch (error) {
      return error.message;
    }
  };
  updateQuantity = async (cartId, productId, newQuantity) => {
    try {
      return await service.updateCartQuantity(cartId, productId, newQuantity);
    } catch (error) {
      return error.message;
    }
  };

  deleteProduct = async (cid, pid) => {
    try {
      return await service.deleteOne(cid, pid);
    } catch (error) {
      return error.message;
    }
  };

  deleteAllProducts = async (cid) => {
    try {
      return await service.deleteAll(cid);
    } catch (error) {
      return error.message;
    }
  };
}

export default cartManagerMdb;
