import ProductsService from "../services/products.dao.js";

const service = new ProductsService();



class productManagerMdb {
  constructor() {}

  getAllProducts = async (limit, page, userQuery, sort, order) => {
    try {
      return await service.get(limit, page, userQuery, sort, order);
    } catch (error) {
      return error.message;
    }
  };

  async addProducts(newProduct) {
    try {
      return await service.add(newProduct);
    } catch (error) {
      return error.message;
    }
  }

  async getProductsById(itemId) {
    try {
      return await service.getById(itemId);
    } catch (error) {
      return error.message;
    }
  }

  async updateProduct(itemId, property) {
    try {
      return await service.update(itemId, property);
    } catch (error) {
      return error.message;
    }
  }

  deleteProduct = async (idDelete) => {
    try {
      return await service.delete(idDelete);
    } catch (error) {
      return error.message;
    }
  };
}

export default productManagerMdb;
