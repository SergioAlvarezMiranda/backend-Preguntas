// -- =======================================================
// -- 1. CREAR TABLAS
// -- =======================================================
// DROP TABLE IF EXISTS card_etiquetas CASCADE;
// DROP TABLE IF EXISTS cards CASCADE;
// DROP TABLE IF EXISTS etiquetas CASCADE;

// CREATE TABLE cards (
//     id SERIAL PRIMARY KEY,
//     pregunta TEXT NOT NULL,
//     respuesta TEXT NOT NULL
// );

// CREATE TABLE etiquetas (
//     id SERIAL PRIMARY KEY,
//     nombre TEXT NOT NULL UNIQUE
// );

// CREATE TABLE card_etiquetas (
//     card_id INT REFERENCES cards(id) ON DELETE CASCADE,
//     etiqueta_id INT REFERENCES etiquetas(id) ON DELETE CASCADE,
//     PRIMARY KEY (card_id, etiqueta_id)
// );

// -- =======================================================
// -- 2. INSERTAR DATOS BASE (PADRES PRIMERO)
// -- =======================================================

// -- Primero etiquetas
// INSERT INTO etiquetas (nombre) VALUES
// ('js'),
// ('php'),
// ('.net');

// -- Luego las tarjetas
// INSERT INTO cards (pregunta, respuesta) VALUES
// ('¿Qué es un closure en JavaScript?', 'Una función que recuerda el ámbito en el que fue creada, incluso después de que dicho ámbito haya terminado.'),
// ('¿Cómo declarar una variable en PHP?', 'Usando el símbolo $ seguido del nombre de la variable.'),
// ('¿Qué es una clase en .NET?', 'Una clase es un tipo de dato que permite definir objetos con propiedades y métodos.');

// -- =======================================================
// -- 3. RELACIONAR (TABLA PUENTE)
// -- =======================================================
// INSERT INTO card_etiquetas (card_id, etiqueta_id) VALUES
// (1, 1), -- closure en JS
// (2, 2), -- variable en PHP
// (3, 3); -- clase en .NET

// -- =======================================================
// -- 4. CONSULTAS DE PRUEBA
// -- =======================================================
// -- Tarjetas con sus etiquetas en un solo resultado
// SELECT c.id, c.pregunta, c.respuesta, array_agg(e.nombre) AS etiquetas
// FROM cards c
// JOIN card_etiquetas ce ON c.id = ce.card_id
// JOIN etiquetas e ON ce.etiqueta_id = e.id
// GROUP BY c.id;

// -- Verificar tablas simples
// SELECT * FROM cards;
// SELECT * FROM etiquetas;
// SELECT * FROM card_etiquetas;

// -- Opción 1: Con ARRAY_AGG (etiquetas como array)
// SELECT c.id, c.pregunta, c.respuesta, array_agg(e.nombre) AS etiquetas
// FROM cards c
// LEFT JOIN card_etiquetas ce ON c.id = ce.card_id
// LEFT JOIN etiquetas e ON ce.etiqueta_id = e.id
// GROUP BY c.id, c.pregunta, c.respuesta;



// -- Opción 2: Con STRING_AGG (etiquetas como string separado por comas)
// SELECT c.id, c.pregunta, c.respuesta,
//        STRING_AGG(e.nombre, ', ') AS etiquetas
// FROM cards c
// LEFT JOIN card_etiquetas ce ON c.id = ce.card_id
// LEFT JOIN etiquetas e ON ce.etiqueta_id = e.id
// GROUP BY c.id, c.pregunta, c.respuesta;

// -- Opción 3: Con JSON_AGG (etiquetas como JSON)
// SELECT c.id, c.pregunta, c.respuesta,
//        JSON_AGG(e.nombre) AS etiquetas
// FROM cards c
// LEFT JOIN card_etiquetas ce ON c.id = ce.card_id
// LEFT JOIN etiquetas e ON ce.etiqueta_id = e.id
// GROUP BY c.id, c.pregunta, c.respuesta;

// -- Opción 4: Filtrar por etiqueta específica
// SELECT c.id, c.pregunta, c.respuesta, array_agg(e.nombre) AS etiquetas
// FROM cards c
// LEFT JOIN card_etiquetas ce ON c.id = ce.card_id
// LEFT JOIN etiquetas e ON ce.etiqueta_id = e.id
// WHERE e.nombre = 'js'  -- Filtrar solo tarjetas de JavaScript
// GROUP BY c.id, c.pregunta, c.respuesta;


// SELECT
//     c.id,
//     c.pregunta,
//     c.respuesta,
//     COALESCE(JSON_AGG(e.nombre) FILTER (WHERE e.nombre IS NOT NULL), '[]') AS etiquetas;
// FROM cards c
// INNER JOIN card_etiquetas ce ON c.id = ce.card_id
// INNER JOIN etiquetas e ON ce.etiqueta_id = e.id
// WHERE e.nombre = 'js'
// GROUP BY c.id, c.pregunta, c.respuesta;



// SELECT E.id E.nombre from etiquetas E
// select * from etiquetas


// ALTER TABLE etiquetas
// ADD CONSTRAINT etiquetas_nombre_unique UNIQUE (nombre)

// INSERT INTO etiquetas (nombre) VALUES ('js');
// INSERT INTO etiquetas (nombre) VALUES ('js');


// select *
// FROM etiquetas
// where nombre = 'js'

// SELECT * FROM etiquetas WHERE nombre = 'python'

// INSERT INTO etiquetas (nombre) VALUES ('pYthon');


// CREATE EXTENSION IF NOT EXISTS citext;

// -- cambiar la columna a citext
// ALTER TABLE etiquetas
// ALTER COLUMN nombre TYPE citext;


// SELECT id FROM etiquetas WHERE nombre ='python';

// DELETE FROM cards WHERE id = 5;






