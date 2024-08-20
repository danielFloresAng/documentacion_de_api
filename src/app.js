import express from "express";
import handelbars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import config from "./config.js";
import socketInit from "./services/sockets.js";
import productsRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import userIndexRouter from "./routes/user.routes.js";
import cookiesRouter from "./routes/cookies.routes.js";
import sessionsRouter from "./routes/session.routes.js";
import authsRouter from "./routes/auth.routes.js";
import initializePassport from "./configs/passport.config.js";
import baseRouter from "./routes/base.routes.js";

const app = express();

const httpInstance = app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGODB_URI);
});
console.log(
  `Servidor funcionando en puerto ${config.PORT} conectada a ${config.SERVER}. PID ${process.pid}`
);
const socketServer = socketInit(httpInstance);

app.set("socketServer", socketServer);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación",
      description: "API E-Commerce",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};
const specs = swaggerJsdoc(swaggerOptions);

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.SECRET));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.MONGODB_URI,
      ttl: 15,
    }),
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.session({ secret: config.SECRET }));
app.use(passport.initialize());

app.engine("handlebars", handelbars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userIndexRouter);
app.use("/api/cookies", cookiesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/auth", authsRouter);
app.use("/api/base", baseRouter);
app.use("/static", express.static(`${config.DIRNAME}/public`));
