import { Router } from "express";

const router = Router();

router.get("/products", (req, res) => {
  res.render("products");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  res.render("profile", { user: req.session.user });
});
router.get("/register", (req, res) => {
  // if (!req.session.user) return res.redirect("/login");

  res.render("register");
});
export default router;
