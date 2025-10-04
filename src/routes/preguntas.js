const express = require("express");
const { obtenerPreguntas, eliminarPregunta, crearPregunta } = require("../controllers/preguntasController");

const router = express.Router();

router.get("/", obtenerPreguntas);
router.post("/", crearPregunta);
router.delete("/:id", eliminarPregunta);

module.exports = router;
