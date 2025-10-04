const express = require("express");
const { obtenerPreguntas } = require("../controllers/preguntasController");
const { crearPregunta } = require("../controllers/preguntasController");
const { eliminar } = require("../services/CardService");

const router = express.Router();

router.get("/", obtenerPreguntas);
router.post("/", crearPregunta);
router.post("/", eliminar);



module.exports = router;



