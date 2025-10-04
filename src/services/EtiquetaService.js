const db = require("../../db");

class EtiquetaService {
    constructor() { }

    async listar() {
        try {
            const query = "SELECT * FROM etiquetas";
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al listar etiquetas:", error);
            throw error;
        }
    }

    async buscarEtiqueta(nombreEtiqueta) {
        try {
            const query = "SELECT id, nombre FROM etiquetas WHERE nombre = $1;";
            const result = await db.query(query, [nombreEtiqueta]);
            return result.rows;
        } catch (error) {
            console.error("Error al buscar la etiqueta:", error);
            throw error;
        }
    }

    async etiquetaExiste(nombreEtiqueta) {
        try {
            const etiquetas = await this.buscarEtiqueta(nombreEtiqueta);
            return Array.isArray(etiquetas) && etiquetas.length > 0;
        } catch (error) {
            console.error("error al verificar la existencia de etiqueta ", error)
            throw error;
        }
    }

    async crear(nombreEtiqueta) {
        try {
            const existe = await this.etiquetaExiste(nombreEtiqueta);
            if (existe) {
                return "La etiqueta ya existe";
            }

            const query = "INSERT INTO etiquetas (nombre) VALUES ($1) RETURNING *;";
            const result = await db.query(query, [nombreEtiqueta]);

            return result.rows[0];

        } catch (error) {
            console.error("Error al crear etiqueta:", error);
            throw error;
        }
    }

    async agregarSiExiste(nombreEtiqueta, idNuevaTarjeta) {
        try {
            const rows = await this.buscarEtiqueta(nombreEtiqueta);

            if (!rows || rows.length === 0) {
                throw new Error(`La etiqueta "${nombreEtiqueta}" no existe`);
            }

            const idEtiqueta = rows[0].id;

            const query = `
            INSERT INTO card_etiquetas (card_id, etiqueta_id) 
            VALUES ($1, $2) 
            RETURNING *;
        `;

            const insertResult = await db.query(query, [idNuevaTarjeta, idEtiqueta]);

            return insertResult.rows[0];
        } catch (error) {
            console.error("Error al agregar etiqueta existente a la tarjeta:", error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const query = "DELETE FROM etiquetas WHERE id = $1 RETURNING *;";
            const result = await db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Error al eliminar etiqueta:", error);
            throw error;
        }
    }
}
module.exports = new EtiquetaService();
