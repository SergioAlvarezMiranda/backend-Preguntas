const pool = require("../dbConexion");

class CardService {
    constructor() { }

    // Listar todas las cards
    async listar() {
        try {
            const result = await pool.query("SELECT c.id, c.pregunta, c.respuesta, JSON_AGG(e.nombre) AS etiquetas FROM cards c LEFT JOIN card_etiquetas ce ON c.id = ce.card_id LEFT JOIN etiquetas e ON ce.etiqueta_id = e.id GROUP BY c.id, c.pregunta, c.respuesta;");
            return result.rows;
        } catch (error) {
            console.error("Error al listar cards:", error);
            throw error;
        }
    }

    async listarPorEtiqueta(nombreEtiqueta) {
        try {
            const result = await pool.query(`
                SELECT 
                    c.id, 
                    c.pregunta, 
                    c.respuesta, 
                    COALESCE(JSON_AGG(e.nombre) FILTER (WHERE e.nombre IS NOT NULL), '[]') AS etiquetas
                FROM cards c
                INNER JOIN card_etiquetas ce ON c.id = ce.card_id
                INNER JOIN etiquetas e ON ce.etiqueta_id = e.id
                WHERE e.nombre = $1
                GROUP BY c.id, c.pregunta, c.respuesta;
            `, [nombreEtiqueta]);
            return result.rows;
        } catch (error) {
            console.error("Error al listar cards por etiqueta:", error);
            throw error;
        }
    }


    // Crear una card
    async crear(pregunta, respuesta) {
        try {
            const result = await pool.query(
                "INSERT INTO cards (pregunta, respuesta) VALUES ($1, $2) RETURNING *;",
                [pregunta, respuesta]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear card:", error);
            throw error;
        }
    }

    // Editar una card por ID
    async editar(id, nuevaPregunta, nuevaRespuesta) {
        try {
            const result = await pool.query(
                "UPDATE cards SET pregunta = $1, respuesta = $2 WHERE id = $3 RETURNING *;",
                [nuevaPregunta, nuevaRespuesta, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error al editar card:", error);
            throw error;
        }
    }

    // Eliminar una card
    async eliminar(id) {
        try {
            const query = "DELETE FROM cards WHERE id = $1 RETURNING *;";
            const result = await pool.query(query, [id]); // ✅ Pasa [id] como segundo parámetro

            // Retorna solo datos serializables
            if (result.rows.length > 0) {
                return {
                    success: true,
                    message: "Card eliminada",
                    data: result.rows[0]
                };
            } else {
                return {
                    success: false,
                    message: "Card no encontrada"
                };
            }
        } catch (error) {
            console.error("Error al eliminar card:", error.message); // ✅ Solo el mensaje
            throw new Error(error.message); // ✅ Lanza solo el mensaje
        }
    }
}

module.exports = new CardService();
