const CardService = require("../services/CardService");
const EtiquetaService = require("../services/EtiquetaService")
const obtenerPreguntas = async (req, res) => {
    try {
       
        const preguntas = await CardService.listar();

        if (!preguntas || preguntas.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No hay preguntas registradas",
                data: [],
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Preguntas obtenidas correctamente",
            count: preguntas.length,
            data: preguntas,
            error: null
        });
    } catch (error) {
        console.error("Error en obtenerPreguntas:", error);
        const isDev = process.env.NODE_ENV === "development";
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error obteniendo las preguntas",
            ...(isDev && { error: error.message }),
            data: null
        });
    }
};


const eliminarPregunta = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "El id es obligatorio",
                data: null
            });
        }

        const resultado = await CardService.eliminar(id);

        return res.status(resultado.success ? 200 : 404).json({
            success: resultado.success,
            message: resultado.success
                ? "Pregunta eliminada correctamente"
                : "No se encontró la pregunta",
            data: resultado.data || null
        });
    } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
        const isDev = process.env.NODE_ENV === "development";
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error interno del servidor",
            ...(isDev && { error: error.message }),
            data: null
        });
    };
};


const crearPregunta = async (req, res) => {
    try {
        const { pregunta, respuesta, etiquetas = [] } = req.body;

        if (!pregunta || !respuesta) {
            return res.status(400).json({
                success: false,
                message: "La pregunta y la respuesta son obligatorias",
                data: null
            });
        }

        const preguntaCreada = await CardService.crear(pregunta, respuesta);

        const etiquetasLimpias = etiquetas
            .filter(e => typeof e === "string" && e.trim() !== "")
            .map(e => e.trim().toLowerCase());

        await Promise.all(
            etiquetasLimpias.map(async (nombreEtiqueta) => {
                const existe = await EtiquetaService.etiquetaExiste(nombreEtiqueta);
                if (!existe) {
                    const nuevaEtiqueta = await EtiquetaService.crear(nombreEtiqueta);
                    await EtiquetaService.agregarSiExiste(nuevaEtiqueta.nombre, preguntaCreada.id);
                } else {
                    await EtiquetaService.agregarSiExiste(nombreEtiqueta, preguntaCreada.id);
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
        const isDev = process.env.NODE_ENV === "development";
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error interno del servidor",
            ...(isDev && { error: error.message }),
            data: null
        });
    }
};



module.exports = { obtenerPreguntas, crearPregunta, eliminarPregunta };
