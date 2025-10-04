const pool = require("../../data/dbConexion");

class CardService {
    constructor() { }

    // Listar todas las cards
    async listar() {
        try {
            const result = await pool.query("SELECT * FROM listar_cards();");
            return result.rows;
        } catch (error) {
            console.error("Error al listar cards:", error);
            throw error;
        }
    }

    async listarPorEtiqueta(nombreEtiqueta) {
        try {
            const result = await pool.query(`
               SELECT * FROM listar_cards_por_etiqueta($1);
            `, [nombreEtiqueta]);
            return result.rows;
        } catch (error) {
            console.error("Error al listar cards por etiqueta:", error);
            throw error;
        }
    }


    // Crear una card
    async crear(pregunta, respuesta, etiquetas) {
        try {
            const result = await pool.query(
                "SELECT * FROM crear_card($1, $2, $3);",
                [pregunta, respuesta, etiquetas]
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
            const result = await pool.query(
                "SELECT * FROM eliminar_card($1);",
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error al eliminar card:", error);
        }
    }
}

module.exports = new CardService();
