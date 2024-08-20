// --------> IMPORTACIONES DESDE NPM
import { Router } from "express";

// --------> IMPORTACIONES INTERNAS
import config from "../config.js";
import cartManagerMdb from "../controllers/cartManagerMdb.js";

// --------> VARIABLES GENERALES PARA LAS RUTAS
const cartRouter = Router();
const manager = new cartManagerMdb();

// --------> ENDPOINTS

// GET para traer todos los carritos
cartRouter.get("/", async (req, res) => {
  try {
    const allCarts = await manager.getAllCarts();

    res.status(200).send({ status: "GET", playload: allCarts });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

// POST para agregar carritos
cartRouter.post("/addCart/:user/:pid", async (req, res) => {
  const user = req.params.user;
  const productId = req.params.pid;

  try {
    const newCart = await manager.addCart(user, productName);
    console.log(newCart);
    res.status(200).send({ origin: config.SERVER, playload: newCart });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

// PUT para actualizar carritos
// actualizar el carrito con un arreglo de productos con el formato especificado arriba.
cartRouter.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await manager.updateCartFormat(cartId);
    res.status(200).send({ origin: config.SERVER, playload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

// poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  (!quantity || isNaN(quantity)) &&
    res.status(500).send({
      status: "error",
      playload: `El valor '${quantity}' es invalido`,
    });

  try {
    const updateQuantity = await manager.updateQuantity(
      cartId,
      productId,
      quantity
    );

    res.status(200).send({ origin: config.SERVER, playload: updateQuantity });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

// DELETE para eliminar el producto seleccionado del carrtito seleccionado
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cartUpdate = await manager.deleteProduct(cartId, productId);

    res.status(200).send({ origin: config.SERVER, playload: cartUpdate });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

// DELETE para eliminar todos los productos del carrito
cartRouter.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const empityCart = manager.deleteAllProducts(cartId);
    res.status(200).send({ origin: config.SERVER, playload: empityCart });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

export default cartRouter;
