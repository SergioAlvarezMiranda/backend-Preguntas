const pool = require("./dbConexion");

const getLanguages = async () => {
    try {
       const result = await pool.query("SELECT id, pregunta, respuesta FROM cards;");
       console.log(result.rows);
    } catch (error) {
        console.error(error);
    }
};

getLanguages();