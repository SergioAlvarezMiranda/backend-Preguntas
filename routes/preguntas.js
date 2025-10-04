const express = require("express");
const { obtenerPreguntas } = require("../controllers/preguntasController");
const { crearPregunta } = require("../controllers/preguntasController");
const { eliminar } = require("../services/CardService");

const router = express.Router();

router.get("/", obtenerPreguntas);
router.post("/", crearPregunta);            // POST /api/preguntas
router.delete("/:id", eliminar);


module.exports = router;