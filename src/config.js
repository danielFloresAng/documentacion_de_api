import * as url from "url";
import { Command } from "commander";
import dotenv from "dotenv";
import path from "path";

//Parseo de opciones de línea de comandos
const program = new Command();

program.option("--mode <mode>").option("--port <port>");
program.parse();
const programOpts = program.opts();

//Parseo de variables de entorno

dotenv.config({
  path: programOpts.mode === "prod" ? ".env.prod" : ".env.devel",
});

//Objeto config
const config = {
  PORT: programOpts.port || 8000,
  SERVER: "Local",
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
  MONGODB_URI:
    "mongodb+srv://danns1125:E-commerce@e-commerce-coder.ksbwadq.mongodb.net/ecommerce",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  SECRET: process.env.SECRET,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

  /*
  SECRET=e-commerce_Mdb_1ld0sd
GITHUB_CLIENT_SECRET=59ee4df3e66e9f95c608086e7c74e091db0a84ca
GITHUB_CLIENT_ID=Iv23lirfI6qp3cYBKkMg
GITHUB_CALLBACK_URL=http://localhost:8080/api/sessions/ghlogincallback
  */
};

export default config;
