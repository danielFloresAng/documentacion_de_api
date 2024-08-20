import { Router } from "express";
import passport from "passport";

import config from "../config.js";
import { isValidPass, createHash, verifyRequired } from "../services/utils.js";
import userManager from "../controllers/usersManagaerMdb.js";
import initializePassport from "../configs/passport.config.js";

const router = Router();
const manager = new userManager();
initializePassport();

const admindAuth = (req, res, next) => {
  if (req.session.user?.role !== "admin")
    return res
      .stauts(403)
      .send({ status: "Error", playload: "Acceso no autorizado" });

  next();
};

router.get("/counter", async (req, res) => {
  try {
    if (req.session.counter) {
      req.session.counter++;
      res.status(200).send({
        origin: config.SERVER,
        playload: `Haz visitado la página ${req.session.counter} veces`,
      });
    } else {
      req.session.counter = 1;
      res.status(200).send({
        origin: config.SERVER,
        playload: `Es tu primer visita`,
      });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", playload: error.message });
  }
});
router.post(
  "/login",
  verifyRequired(["email", "password"]),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const findUser = await manager.getUser({ email: email });

      if (findUser && isValidPass(password, findUser.password)) {
        const { password, ...filteredFindUser } = findUser;
        req.session.user = filteredFindUser;
        req.session.save((error) => {
          return error
            ? res.status(500).send({
                origin: config.SERVER,
                error: error.message,
              })
            : res.redirect("/profile");
        });
      } else {
        res
          .status(401)
          .send({ origin: config.SERVER, playload: "Datos no válidos" });
      }
    } catch (error) {
      res.status(500).send({ status: "Error", playload: error.message });
    }
  }
);
router.post(
  "/passportLogin",
  verifyRequired(["email", "password"]),
  passport.authenticate("login", {
    failureRedirect: `/login?error=${encodeURI("Usuario o clave no válidos")}`,
  }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      req.session.save((error) => {
        return error
          ? res
              .status(500)
              .send({ origin: config.SERVER, error: error.message })
          : res.redirect("/profile");
      });
    } catch (error) {
      res
        .status(500)
        .send({ origin: config.SERVER, payload: null, error: err.message });
    }
  }
);

router.get("/hash/:password", async (req, res) => {
  res
    .status(200)
    .send({ origin: config.SERVER, playload: createHash(req.params.passport) });
});

router.post(
  "/register",
  verifyRequired(["firstName", "lastName", "email", "password"]),
  async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const foundUser = await manager.getUser({ email: email });

      if (foundUser) {
        res.status(400).send({
          origin: config.SERVER,
          playload: `El email "${email}" ya se encuentra registrado`,
        });
      }
      const process = await manager.addUser({
        firstName,
        lastName,
        email,
        password: createHash(password),
      });
      res.status(200).send({ origin: config.SERVER, playload: process });
    } catch (error) {
      res.status(500).send({ origin: config.SERVER, error: error.message });
    }
  }
);
// Ruta de autenticación con git hub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);
router.get(
  "/ghlogincallback",
  passport.authenticate("github", {
    failureRedirect: `/login?error=${encodeURI(
      "Error al identificar con Github"
    )}`,
  }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      req.session.save((error) => {
        if (error)
          returnres.status(500).send({ status: "Error", error: error.message });
        res.redirect("/profile");
      });
      res.status(200).send({ origin: config.SERVER, playload: "DELETE" });
    } catch (error) {
      res.status(500).send({ status: "Error", playload: error.message });
    }
  }
);
router.delete("/", async (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, playload: "DELETE" });
  } catch (error) {
    res.status(500).send({ status: "Error", playload: error.message });
  }
});

router.get("/current", async (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, playload: "DELETE" });
  } catch (error) {
    res.status(500).send({ status: "Error", playload: error.message });
  }
});

router.get("/failregister", async (req, res) => {
  try {
    res.send({ origin: config.SERVER, message: "Failed Strategy" });
    console.log("Failed Strategy");
  } catch (error) {
    res.status(500).send({ status: "Error", playload: error.message });
  }
});

export default router;
