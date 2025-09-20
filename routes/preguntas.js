const express = require("express");
const router = express.Router();
const { obtenerPreguntas } = require("../controllers/preguntasController");

router.get("/", obtenerPreguntas);

module.exports = router;
