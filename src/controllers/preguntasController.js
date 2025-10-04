const CardService = require("../services/CardService");
const EtiquetaService = require("../services/EtiquetaService")

const obtenerPreguntas = async (req, res) => {
    try {
        const preguntas = await CardService.listar();

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
            count: preguntas.length,
            data: preguntas
        });
    } catch (error) {
        console.error("Error en obtenerPreguntas:", error);
        return res.status(500).json({ success: false, message: "Ocurrió un error obteniendo las preguntas", data: null });
    };
}

const eliminarPregunta = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await CardService.eliminar(id);
        res.status(resultado.success ? 200 : 404).json(resultado);
    } catch (error) {
        res.status(500).json({ success: false, message: "Ocurrió un error eliminando la pregunta", error: error.message, data: null });
    }
};

const crearPregunta = async (req, res) => {
    try {
        const { pregunta, respuesta, etiquetas = [] } = req.body;

        if (!pregunta || !respuesta) {
            return res.status(400).json({ success: false, message: "La pregunta y la respuesta son obligatorias", data: null });
        }

        const preguntaCreada = await CardService.crear(pregunta, respuesta);

        await Promise.all(
            etiquetas.map(async (nombreEtiqueta) => {
                const existe = await EtiquetaService.etiquetaExiste(nombreEtiqueta);

                if (!existe) {
                    const nuevaEtiqueta = await EtiquetaService.crear(nombreEtiqueta);
                    await EtiquetaService.agregarSiExiste(nuevaEtiqueta.nombre, preguntaCreada.id);
                } else {
                    await EtiquetaService.agregarSiExiste(nombreEtiqueta, preguntaCreada.id)
                }
            })
        );

        return res.status(201).json({ success: true, message: "Pregunta y etiquetas creadas correctamente", data: preguntaCreada });

    } catch (error) {
        console.error("Error al crear la pregunta:", error);
        return res.status(500).json({ success: false, message: "Ocurrió un error al crear la pregunta", data: null });
    }
};

module.exports = { obtenerPreguntas, crearPregunta, eliminarPregunta };
