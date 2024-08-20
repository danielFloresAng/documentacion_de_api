import { Router, json } from "express";

import config from "../config.js";
import {
  generateToken,
  authThoken,
  passportCall,
  // authorization,
  handlePolicies,
} from "../services/utils.js";
import { createHash } from "../services/utils.js";
import UserManager from "../controllers/usersManagaerMdb.js";

const router = Router();
const manager = new UserManager();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (firstName && lastName && email && password) {
      let newUser = {
        firstName,
        lastName,
        email,
        password: createHash(password),
      };
    } else {
      res.status(400).send({ status: "Error", playload: "Datos no válidos" });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", playload: error.message });
  }
});

// -----> REGISTRO CON JWT
router.post("/registerJwt", async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const userExist = await manager.getUser({ email: email });
    if (userExist)
      return res
        .status(400)
        .send({ status: "error", error: "el usuario ya existe" });

    const user = {
      firstName,
      lastName,
      email,
      password: createHash(password),
    };

    manager.addUser(user);

    const access_token = generateToken(user);

    res.status(200).send({ status: "Registro exitoso", access_token });
  } catch (error) {
    res.status(400).send({ origin: config.SERVER, error: error.message });
  }
});

// -----> LOG IN CON JWT
router.post("/loginJwt", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = manager.getUser({ email: email, password: password });

    if (!user)
      return res
        .status(400)
        .send({ status: "error", error: "Datos no válidos" });

    const access_token = generateToken(user);
    const cookieToken = JSON.stringify(user.email);
    res
      .cookie(cookieToken, access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ message: "Ingreso exitoso" });
  } catch (error) {
    res.status(400).send({ origin: config.SERVER, error: error.message });
  }
});

// -----> LOG IN CON JWT
router.get(
  "/currentJwt",
  authThoken,
  passportCall("jwt"),
  // authorization("user"),
  async (req, res) => {
    try {
      res.status(200).send({ status: "Ingreso exitoso", playload: req.user });
    } catch (error) {
      res.status(400).send({ origin: config.SERVER, error: error.message });
    }
  }
);

router.get(
  "/admin",
  authThoken,
  handlePolicies(["admin"]),
  async (req, res) => {
    try {
      res.status(200).send({ origin: config.SERVER, playload: "Message" });
    } catch (error) {
      res.status(500).send({ origin: config.SERVER, Error: "Error" });
    }
  }
);
// router.get('',async(req,res)=>{
//   try{
//     res.status(200).send({origin: config.SERVER, playload:'Message'})
//   }catch(error){

//     res.status(500).send({origin: config.SERVER, Error:'Error'})
//   }
// })

export default router;
