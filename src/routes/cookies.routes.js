import { Router } from "express";
import config from "../config.js";

const router = Router();

router.get("/setCookies", async (req, res) => {
  const cookieData = { name: "Faye Valentine", age: 32, role: "user" };
  res.cookie("mi_cookie", JSON.stringify(cookieData), {
    maxAge: 30000,
    signed: true,
  });
  try {
    res.status(200).send({ origin: config.SERVER, playload: "set cookie" });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
});
router.get("/getCookies", async (req, res) => {
  try {
    const cookie = JSON.parse(req.signedCookies["mi_cookie"]);
    res.status(200).send({ origin: config.SERVER, playload: cookie });
  } catch (error) {
    res.status(500).send({ status: "Error", playload: error.message });
  }
});
router.get("/clearCookies", async (req, res) => {
  try {
    res.clearCookie("mi_cookie");
    res.status(200).send({ origin: config.SERVER, playload: "clear cookie" });
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
});

export default router;
