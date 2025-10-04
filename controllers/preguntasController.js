const CardService = require("../services/CardService");
const EtiquetaService = require("../services/EtiquetaService")

/**
 * Lista todas las preguntas con sus etiquetas
 * @route GET /preguntas
 * @returns {JSON} - Devuelve un JSON con todas las cartas.
 */
const obtenerPreguntas = async (req, res) => {
    try {
        const preguntas = await CardService.listar();

        // Si no hay preguntas, devolver un array vacío pero con success
        if (!preguntas || preguntas.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No hay preguntas registradas",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Preguntas obtenidas correctamente",
            count: preguntas.length,   // 🔑 útil para frontend
            data: preguntas
        });
    } catch (error) {
        console.error("Error en obtenerPreguntas:", error);

        return res.status(500).json({
            success: false,
            message: "Ocurrió un error obteniendo las preguntas",
            data: null
        });

    };
}


const EliminarPregunta = async (id) => {
    try {
        const resultado = await CardService.eliminar(id);
        return resultado;
    } catch (error) {
        console.error("Error en eliminarPregunta:", error);
        throw error;
    }
};

/**
 * Crea una nueva pregunta con sus etiquetas
 * @route POST /preguntas
 * @param {string} req.body.pregunta - Texto de la pregunta
 * @param {string} req.body.respuesta - Texto de la respuesta
 * @param {Array<string>} req.body.etiquetas - Lista de etiquetas
 * @returns {JSON} - Pregunta creada con sus etiquetas
 */
const crearPregunta = async (req, res) => {
    try {
        const { pregunta, respuesta, etiquetas = [] } = req.body;

        // si están vacíos return directamente
        if (!pregunta || !respuesta) {
            return res.status(400).json({
                success: false,
                message: "La pregunta y la respuesta son obligatorias",
                data: null
            });
        }

        // Crear la pregunta
        const preguntaCreada = await CardService.crear(pregunta, respuesta);

        // Procesar etiquetas en paralelo
        await Promise.all(
            etiquetas.map(async (nombreEtiqueta) => {
                const existe = await EtiquetaService.etiquetaExiste(nombreEtiqueta);

                if (!existe) {
                    return EtiquetaService.crear(nombreEtiqueta);
                }
            })
        );

        return res.status(201).json({
            success: true,
            message: "Pregunta y etiquetas creadas correctamente",
            data: preguntaCreada
        });

    } catch (error) {
        console.error("Error al crear la pregunta:", error);

        return res.status(500).json({
            success: false,
            message: "Ocurrió un error al crear la pregunta",
            data: null
        });
    }
};


const EditarPregunta = async (pregunta) => {
};

module.exports = { obtenerPreguntas, crearPregunta, EliminarPregunta };

