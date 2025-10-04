const pool = require("../dbConexion");

class EtiquetaService {
    constructor() { }

    // Listar todas las cards
    async listar() {
        try {
            const query = "SELECT * FROM etiquetas";
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al listar cards:", error);
            throw error;
        }
    }

    /**
* busca una etiqueta por su nombre y la devuelve si existe.
*
* @param {string} nombreEtiqueta - Nombre de la etiqueta a buscar.
* @returns {Promise<Object|string>} - Devuelve el nombre de la etiqueta en caso que exista y caso contrario null.
* @throws {Error} - Lanza un error si la operación con la base de datos falla.
*/
    async buscarEtiqueta(nombreEtiqueta) {
        try {
            const query = "SELECT * FROM etiquetas WHERE nombre = $1;";
            const result = await pool.query(query, [nombreEtiqueta]);
            return result.rows || null;
        } catch (error) {
            console.error("Error al buscar la etiqueta:", error);
            throw error;
        }
    }

    /**
* verifica si una etiqueta ya existe.
*
* @param {string} nombreEtiqueta - Nombre de la etiqueta a verificar.
* @returns {Promise<Object|string>} - Devuelve un true si existe false si no existe la etiqueta.
* @throws {Error} - Lanza un error si la operación con la base de datos falla.
*/
    async etiquetaExiste(nombreEtiqueta) {
        try {
            const etiquetas = await this.buscarEtiqueta(nombreEtiqueta); // esperas la promesa
            return etiquetas.length > 0; // si hay al menos un resultado, existe
        } catch (error) {
            console.error("error al verificar la existencia de etiqueta ", error)
            throw error;
        }
    }

    /**
 * Crea una nueva etiqueta si no existe previamente.
 *
 * @param {string} nombreEtiqueta - Nombre de la etiqueta a crear.
 * @returns {Promise<Object|string>} - Devuelve la etiqueta creada como objeto o un string indicando que ya existe.
 * @throws {Error} - Lanza un error si la operación con la base de datos falla.
 */
    async crear(nombreEtiqueta) {
        try {
            const existe = await this.etiquetaExiste(nombreEtiqueta);
            if (existe) {
                return "La etiqueta ya existe";
            }

            const query = "INSERT INTO etiquetas (nombre) VALUES ($1) RETURNING *;";
            const result = await pool.query(query, [nombreEtiqueta]);

            return result.rows[0];

        } catch (error) {
            console.error("Error al crear card:", error);
            throw error;
        }
    }

    /**
     * Elimina una etiqueta por su ID.
     *
     * @param {number} id - ID de la etiqueta a eliminar.
     * @returns {Promise<Object|null>} - Devuelve la etiqueta eliminada como objeto si existía,
     *                                   o null si no se encontró ninguna con ese ID.
     * @throws {Error} - Lanza un error si ocurre un problema en la operación con la base de datos.
     */
    async eliminar(id) {
        try {
            const query = "DELETE FROM etiquetas WHERE id = $1 RETURNING *;";
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Error al eliminar etiqueta:", error);
            throw error;
        }
    }
}
module.exports = new EtiquetaService();
