const express = require("express");
const { obtenerPreguntas, eliminarPregunta } = require("../controllers/preguntasController");
const { crearPregunta } = require("../controllers/preguntasController");

const router = express.Router();

router.get("/", obtenerPreguntas);
router.post("/", crearPregunta);            // POST /api/preguntas
router.delete("/:id", eliminarPregunta);


module.exports = router;