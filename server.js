const express = require("express");
const cors = require("cors");
const preguntasRoutes = require("./routes/preguntas");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/preguntas", preguntasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
