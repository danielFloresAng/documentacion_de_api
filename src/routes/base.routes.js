import { Router } from "express";
import config from "../config.js";
const router = Router();

const listNumbers = (...numbers)=>{
numbers.forEach(number =>{
  isNaN(number) ? console.log('invalid') && process.exit(-4) : console.log(number)
})
}


router.get("/", async (req, res) => {
  try {
    res.status(200).send({ origin: config.SERVER, playload: `Servidor activo por  ${process.uptime()}` });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, playload: error.message });
  }
});
router.get("/list", async (req, res) => {
  try {

    listNumbers(1,2,'base',4,5)
    res.status(200).send({ origin: config.SERVER, playload: `Función ejecutada` });
  } catch (error) {
    res.status(500).send({ origin: config.SERVER, playload: error.message });
  }
});

export default router;
