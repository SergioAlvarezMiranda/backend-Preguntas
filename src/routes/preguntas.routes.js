const express = require("express");
const { obtenerPreguntas, eliminarPregunta, crearPregunta } = require("../controllers/preguntasController");

const router = express.Router();

router.get("/", obtenerPreguntas);
router.post("/", crearPregunta);
router.delete("/:id", eliminarPregunta);
// router.delete("/:id", (req, res) => {
// console.log("estoy aqui esperando por ti")
// });

module.exports = router;
