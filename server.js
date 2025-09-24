const preguntasRoutes = require("./routes/preguntas");
app.use("/api/preguntas", preguntasRoutes);
module.exports = { preguntasRoutes };
