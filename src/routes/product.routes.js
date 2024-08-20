import { Router } from "express";

import productManagerMdb from "../controllers/productManagerMdb.js";
import config from "../config.js";
import router from "./auth.routes.js";

const productsRouter = Router();
const manager = new productManagerMdb();

//GET para traer todos los productos
productsRouter.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const page = parseInt(req.query.page) || 1;
  const userQuery = req.query.userQuery;
  const sortBy = req.query.sort;
  // const sortOrder = JSON.parse(req.query.order);

  try {
    const allProducts = await manager.getAllProducts(
      limit,
      page,
      userQuery,
      sortBy
      // sortOrder
    );

    const totalPages = Math.ceil(
      (await manager.getAllProducts()).length / limit
    );

    const pageLimit = page + 1 > totalPages;

    res.status(200).send({
      origin: config.SERVER,
      playload: allProducts,
      totalPages: totalPages,
      prevPage:
        page - 1 === 0
          ? "Esta es la primer página, no hay página anterior"
          : page - 1,
      nextPage: pageLimit ? "Esta es la página final" : page + 1,
      page: page,
      hasPrevPage: page - 1 > 0 ? true : false,
      hasNextPage: pageLimit ? false : true,
      prevLink:
        page - 1 === 0
          ? null
          : `http://localhost:8080/api/products?limit=${limit}&page=${
              page - 1
            }`,
      nextLink: pageLimit
        ? null
        : `http://localhost:8080/api/products?limit=${limit}&page=${page + 1}`,
    });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, error: error.message });
  }
});

//GET para filtrar productos por ID
productsRouter.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  const text = config.MONGODB_ID_REGEX.test(id);

  try {
    if (text) {
      const filter = await manager.getProductsById(id);
      res.status(200).send({ origin: config.SERVER, playload: filter });
    } else {
      res
        .status(200)
        .send({
          origin: config.SERVER,
          playload: null,
          error: "ID de producto no válido",
        });
    }
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, error: error.message });
  }
});
//POST para agregar productos
productsRouter.post("/newProduct", async (req, res) => {
  const productBody = req.body;

  try {
    await manager.addProducts(productBody);
    const products = await manager.getAllProducts();

    res.status(200).send({ origin: config.SERVER, playload: products });
  } catch (error) {
    res.status(500).send({
      origin: config.SERVER,
      error: `Error al crear producto: ${error.message}`,
    });
  }
});
//PUT para actualizar productos por ID
productsRouter.put("/updateProduct/:pid", async (req, res) => {
  let id = req.params.pid;
  const updateBody = req.body;

  try {
    await manager.updateProduct(id, updateBody);
    const products = await manager.getAllProducts();

    res.status(200).send({ origin: config.SERVER, playload: products });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, error: error.message });
  }
});

//DELETE para eliminar productos por ID
productsRouter.delete("/deleteProduct/:pid", async (req, res) => {
  const itemID = req.params.pid;

  try {
    await manager.deleteProduct(itemID);
    const products = await manager.getAllProducts();
    res.status(200).send({ status: "on", playload: products });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, error: error.message });
  }
});

router.all("*", async (req, res) => {
  res
    .status(404)
    .send({ origin: config.SERVER, error: "No se encuentra la ruta" });
});

export default productsRouter;


