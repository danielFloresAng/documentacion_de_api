import productsModel from '../models/products.models.js'

class ProductsService {
  constructor() {
    this.products = productsModel;
  }

  get = async (limit, page, userQuery, sort, order) => {
    let sortBy = sort;

    let query = {};
    if (userQuery) {
      query = { category: userQuery };
    }
    return await this.products
      .find(query)
      .sort({ [sortBy]: order || 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  };

  async add(newProduct) {
    await this.products.create(newProduct);
  }

  async getById(itemId) {
    let productFiler = await this.products.findOne({
      _id: itemId,
    });

    return productFiler;
  }

  async update(itemId, property) {
    await this.products.findOneAndUpdate({ _id: itemId }, { $set: property });
  }

  delete = async (idDelete) => {
    await this.products.deleteOne({ _id: idDelete });
  };
}

export default ProductsService;
