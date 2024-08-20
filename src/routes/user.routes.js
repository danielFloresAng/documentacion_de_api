import { Router } from "express";

import userIndexModel from "../controllers/usersManagaerMdb.js";
import config from "../config.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allUsers = await userIndexModel.find().limit(10).skip(1).lean();

    res.status(200).send({ origin: config.SERVER, playload: allUsers });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, message: error.message });
  }
});

router.post("/", (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, playload: "post" });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, message: error.message });
  }
});

router.put("/", (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, playload: "put" });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, message: error.message });
  }
});

router.delete("/", (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, playload: "delete" });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, message: error.message });
  }
});

export default router;
