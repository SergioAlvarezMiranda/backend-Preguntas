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

-- ======================= Function =========================
CREATE OR REPLACE FUNCTION listar_cards()
RETURNS TABLE (
    id INT,
    pregunta TEXT,
    respuesta TEXT,
    etiquetas JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.pregunta,
        c.respuesta,
        COALESCE(JSON_AGG(e.nombre) FILTER (WHERE e.nombre IS NOT NULL), '[]') AS etiquetas
    FROM cards c
    LEFT JOIN card_etiquetas ce ON c.id = ce.card_id
    LEFT JOIN etiquetas e ON ce.etiqueta_id = e.id
    GROUP BY c.id, c.pregunta, c.respuesta;
END;
$$ 

LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION listar_cards_por_etiqueta(nombre_etiqueta TEXT)
RETURNS TABLE (
    id INT,
    pregunta TEXT,
    respuesta TEXT,
    etiquetas JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.pregunta,
        c.respuesta,
        COALESCE(JSON_AGG(e.nombre) FILTER (WHERE e.nombre IS NOT NULL), '[]') AS etiquetas
    FROM cards c
    INNER JOIN card_etiquetas ce ON c.id = ce.card_id
    INNER JOIN etiquetas e ON ce.etiqueta_id = e.id
    WHERE e.nombre = nombre_etiqueta
    GROUP BY c.id, c.pregunta, c.respuesta;
END;
$$ 

LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.crear_card(
    p_pregunta TEXT,
    p_respuesta TEXT,
    p_etiquetas TEXT[]
)
RETURNS TABLE(
    card_id INT,
    pregunta TEXT,
    respuesta TEXT,
    etiquetas CITEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_card_id INT;
    v_etiqueta_id INT;
    v_nombre TEXT;
BEGIN
    -- 1. Insertar la card
    INSERT INTO public.cards (pregunta, respuesta)
    VALUES (p_pregunta, p_respuesta)
    RETURNING cards.id INTO v_card_id;

    -- 2. Manejar las etiquetas
    IF p_etiquetas IS NOT NULL THEN
        FOREACH v_nombre IN ARRAY p_etiquetas
        LOOP
            -- Crear la etiqueta si no existe
            INSERT INTO public.etiquetas (nombre)
            VALUES (v_nombre)
            ON CONFLICT (nombre) DO NOTHING;

            -- Obtener el id de la etiqueta
            SELECT e.id INTO v_etiqueta_id
            FROM public.etiquetas e
            WHERE e.nombre = v_nombre;

            -- Insertar la relación
            INSERT INTO public.card_etiquetas (card_id, etiqueta_id)
            VALUES (v_card_id, v_etiqueta_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END IF;

    -- 3. Retornar la card con todas sus etiquetas
    RETURN QUERY
    SELECT c.id AS card_id,
           c.pregunta,
           c.respuesta,
           ARRAY_AGG(e.nombre) AS etiquetas
    FROM public.cards c
    LEFT JOIN public.card_etiquetas ce ON c.id = ce.card_id
    LEFT JOIN public.etiquetas e ON ce.etiqueta_id = e.id
    WHERE c.id = v_card_id
    GROUP BY c.id, c.pregunta, c.respuesta;
END;
$$;


CREATE OR REPLACE FUNCTION public.eliminar_card(
    p_card_id INT
)
RETURNS TABLE(
    card_id INT,
    pregunta TEXT,
    respuesta TEXT,
    etiquetas TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Retornar datos antes de eliminar
    RETURN QUERY
    SELECT c.id AS card_id,
           c.pregunta,
           c.respuesta,
           ARRAY_AGG(e.nombre)::TEXT[] AS etiquetas
    FROM public.cards AS c
    LEFT JOIN public.card_etiquetas AS ce ON c.id = ce.card_id
    LEFT JOIN public.etiquetas AS e ON ce.etiqueta_id = e.id
    WHERE c.id = p_card_id
    GROUP BY c.id, c.pregunta, c.respuesta;

    -- 2. Eliminar relaciones en card_etiquetas
    DELETE FROM public.card_etiquetas AS ce
    WHERE ce.card_id = p_card_id;

    -- 3. Eliminar la card
    DELETE FROM public.cards AS c
    WHERE c.id = p_card_id;

    -- 4. (Opcional) Eliminar etiquetas huérfanas
    DELETE FROM public.etiquetas AS e
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.card_etiquetas AS ce
        WHERE ce.etiqueta_id = e.id
    );
END;
$$;

LANGUAGE plpgsql;



SELECT * FROM public.crear_card(
    '¿Qué es Node.js?',
    'Node.js es un entorno de ejecución para JavaScript basado en el motor V8 de Chrome.',
    ARRAY['backend', 'javascript']
);

SELECT * FROM public.eliminar_card(2);


SELECT * FROM listar_cards_por_etiqueta('Matemáticas');


SELECT * FROM listar_cards();



DO
$$
	DECLARE 
		rec record := NULL; -- Declarondo una variable
		contador integer :=0;
	BEGIN
		FOR rec IN SELECT * FROM "cards" LOOP
			RAISE NOTICE 'La Persona se llama %', rec.respuesta;
			contador := contador +1;
		END LOOP;

		RAISE NOTICE 'La cantidad de persona es:%', contador;
	END
$$



