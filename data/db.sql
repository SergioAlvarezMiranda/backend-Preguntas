-- =======================================================
-- 1. CREAR TABLAS
-- =======================================================
DROP TABLE IF EXISTS card_etiquetas CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS etiquetas CASCADE;

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL
);

CREATE TABLE etiquetas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE card_etiquetas (
    card_id INT REFERENCES cards(id) ON DELETE CASCADE,
    etiqueta_id INT REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, etiqueta_id)
);

-- =======================================================
-- 2. INSERTAR DATOS BASE (PADRES PRIMERO)
-- =======================================================

-- Primero etiquetas
INSERT INTO etiquetas (nombre) VALUES
('js'),
('php'),
('.net');

-- Luego las tarjetas
INSERT INTO cards (pregunta, respuesta) VALUES
('¿Qué es un closure en JavaScript?', 'Una función que recuerda el ámbito en el que fue creada, incluso después de que dicho ámbito haya terminado.'),
('¿Cómo declarar una variable en PHP?', 'Usando el símbolo $ seguido del nombre de la variable.'),
('¿Qué es una clase en .NET?', 'Una clase es un tipo de dato que permite definir objetos con propiedades y métodos.');

-- =======================================================
-- 3. RELACIONAR (TABLA PUENTE)
-- =======================================================
INSERT INTO card_etiquetas (card_id, etiqueta_id) VALUES
(1, 1), -- closure en JS
(2, 2), -- variable en PHP
(3, 3); -- clase en .NET

-- =======================================================
-- 4. CONSULTAS DE PRUEBA
-- =======================================================
-- Tarjetas con sus etiquetas en un solo resultado
SELECT c.id, c.pregunta, c.respuesta, array_agg(e.nombre) AS etiquetas
FROM cards c
JOIN card_etiquetas ce ON c.id = ce.card_id
JOIN etiquetas e ON ce.etiqueta_id = e.id
GROUP BY c.id;


ALTER TABLE etiquetas
ADD CONSTRAINT etiquetas_nombre_unique UNIQUE (nombre);


-- Validar el nombre en la tabla etiquetas - evitar duplicados
CREATE EXTENSION IF NOT EXISTS citext; 
ALTER TABLE etiquetas ALTER COLUMN nombre TYPE citext;

INSERT INTO etiquetas (nombre) values ('PHP');

DELETE FROM etiquetas WHERE ID = '4';

-- Verificar tablas simples
SELECT * FROM cards;
SELECT * FROM etiquetas;
SELECT * FROM card_etiquetas;
