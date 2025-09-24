const CardService = require("../services/CardService");

const obtenerPreguntas = async (req, res) => {
    try {
        const preguntas = await CardService.listar();
        res.json(preguntas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo las preguntas" });
    }
};

module.exports = { obtenerPreguntas };
// ...existing code...