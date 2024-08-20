import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

import config from "../config.js";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPass = (enteredPassword, savedPassword) =>
  bcrypt.compareSync(enteredPassword, savedPassword);

export const verifyRequired = (required) => {
  return (req, res, next) => {
    const verifiedOk = required.every((field) => {
      req.body.hasOwnProperty(field) &&
        req.body[field] !== "" &&
        req.body[field] !== null &&
        req.body[field] !== undefined;
    });
    return verifiedOk
      ? next()
      : res.status(400).send({
          origin: config.SERVER,
          payload: "Faltan propiedades",
          required,
        });
  };
};

const PRIVATE_KEY = config.SECRET;

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};
export const authThoken = (req, res, next) => {
  const authHeader = req.headers.authorization
    ? req.headers.authorization.split("")[1]
    : undefined;

  const cookieToken =
    req.cookies && req.cookies[`${JSON.stringify(user.email)}`]
      ? req.cookies[`${JSON.stringify(user.email)}`]
      : undefined;

  const queryToken = req.query.access_token
    ? req.query.access_token
    : undefined;
  const receivedToken = authHeader || cookieToken || queryToken;

  if (!receivedToken)
    return res
      .status(401)
      .send({ origin: config.SERVER, playload: "Token requerido" });

  jwt.verify(authHeader, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "No autorizado" });
    req.user = credentials.user;
    next();
  });
};
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) return next(error);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    });
    req, res, next;
  };
};
/*export const authorization = (req, res, next, role) => {
  if (!req.user) return res.status(401).send({ error: "No autorizado" });
  
  if (req.user.role != role)
    return res.status(403).send({ error: "Sin permisos válidos" });
  next();
};*/
export const testId = (req, res, next) => {
  const test = config.MONGODB_ID_REGEX.test(req.params.id);
  if (!test)
    return res
      .status(400)
      .send({ origin: config.SERVER, error: "ID no válido" });
  next();
};
export const handlePolicies = policies => {
  return async (req, res, next) => {
   
    if (!req.user) return res.status(401).send({ origin: config.SERVER, payload: 'Usuario no autenticado' });
    if (policies.includes(req.user.role)) return next();
    res.status(403).send({ origin: config.SERVER, payload: 'No tiene permisos para acceder al recurso' });
}
};
 