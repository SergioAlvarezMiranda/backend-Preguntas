

const obtenerPreguntas = async (res) => {
    try {
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo las preguntas" });
    }
};

module.exports = { obtenerPreguntas };
