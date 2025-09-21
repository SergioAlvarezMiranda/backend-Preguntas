const pool = require("../dbConexion");

const obtenerPreguntas = async (req, res) => {
    try {
        const { etiqueta } = req.query;

        let query = `
      SELECT c.id, c.pregunta, c.respuesta, array_agg(e.nombre) AS etiquetas
      FROM cards c
      JOIN card_etiquetas ce ON c.id = ce.card_id
      JOIN etiquetas e ON ce.etiqueta_id = e.id
    `;

        if (etiqueta) {
            query += ` WHERE e.nombre = $1`;
        }

        query += ` GROUP BY c.id ORDER BY c.id`;

        const result = etiqueta
            ? await pool.query(query, [etiqueta])
            : await pool.query(query);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo las preguntas" });
    }
};

module.exports = { obtenerPreguntas };
