CREATE DATABASE vida_sana;
\c vida_sana;

CREATE TABLE eventos (id SERIAL, titulo VARCHAR(50) NOT NULL, descripcion VARCHAR(250) NOT NULL, fecha DATE NOT NULL, lugar VARCHAR(50) NOT NULL);

INSERT INTO eventos values
(DEFAULT, 'Sube tu autoestima', 'Vive la experiencia de subir uno de los cerros mas desafiantes de la ciudad con los mejores guias', '2022-11-27', 'Jardin Rojo'),
(DEFAULT, 'Ponle sabor a tu vaso de agua', 'Aprende todas las combinaciones deliciosas que puedes hacer para disfrutar tu hidratacion', '2022-10-15', 'Plaza Leones'),
(DEFAULT, 'Pedalea tus pulmones', 'Ven a disfrutar un paseo en bicicleta con todos tus vecinos', '2022-08-16', 'Parque Japones')


CREATE TABLE usuarios (id SERIAL, email VARCHAR(50) NOT NULL, password VARCHAR(60) NOT NULL);

INSERT INTO usuarios values
(DEFAULT, 'admin@vidasana.com', '123456'),
(DEFAULT, 'manager@vidasana.com', 'abcdefg');

SELECT * FROM eventos;
SELECT * FROM usuarios;


-- DROP TABLE eventos;

***
Rutas 

http://localhost:3000/
http://localhost:3000/eventos
http://localhost:3000/eventos/3
http://localhost:3000/login

Login

{
  "email": "admin@vidasana.com",
 "password":  "123456"
  
}

Apuntar token cada vez:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHZpZGFzYW5hLmNvbSIsImlhdCI6MTY3NDUzMDEzNX0.zVpcWbaOe-ieIt_Ay9THeS0HwLnCQ7uNpzU_8_gA51k

Probando método PUT para cambiar la fecha del tercer registro 

{
  "titulo": "Pedalea tus pulmones",
  "descripcion": "Ven a disfrutar un paseo en bicicleta con todos tus vecinos",
  "fecha": "2022-10-29",
  "lugar": "Parque Japones"
}

****

Revisión de error al método PUT 

There could be several reasons why the function is returning a 500 error. Here are a few potential causes:

Database connection error: The function is using the pool.query method to execute the update query, but if there is an issue with the database connection, this method will throw an error and the function will catch it and return a 500 error.

Syntax error in the SQL query: If there is a syntax error in the SQL query, the query will not execute correctly and will throw an error.

Missing or incorrect environment variables: If the function is missing any of the environment variables required for the database connection, it will throw an error.

incorrect table name or column name: If the table name or column name used in the SQL query is incorrect, the query will not execute correctly and will throw an error.

Concurrent update: If two or more requests are trying to update the same record at the same time, the first one will be successful, but the second one will fail because the record will be locked.

Incorrect datatype provided: If the data provided does not match the datatype of the column in the table, the query will fail.

Error in Rollback: If the rollback query fails, the function will throw an error.

It is important to check the logs to see what the specific error message is, and also check the database connection and SQL query to see if they are correct.




