const express = require("express");
const cors = require("cors");
const preguntasRoutes = require("./routes/preguntas");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/preguntas", preguntasRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
    res.json({ 
        message: "¡Servidor funcionando correctamente!",
        api: "Visita /api/preguntas para usar la API"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api/preguntas`);
});
