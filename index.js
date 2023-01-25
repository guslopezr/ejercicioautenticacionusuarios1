const jwt = require("jsonwebtoken")
const express = require('express')
const app = express()
const cors = require('cors')
const { getEventos, deleteEvento, verificarCredenciales, actualizarEvento, registrarUsuario } = require('./consultas')

app.listen(3000, console.log("SERVIDOR ENCENDIDO"))
app.use(cors())
app.use(express.json())

app.get("/eventos", async(req, res) => {
    try {
        const eventos = await getEventos()
        res.json(eventos)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.post("/login", async(req, res) => {
    try {

        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ", { expiresIn: 60 })
        res.send(token)
    } catch (error) {

        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

app.post("/usuarios", async(req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})


app.delete("/eventos/:id", async(req, res) => {
    try {
        const { id } = req.params
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
            // La verificación de tokens se realiza por medio del método verify
        jwt.verify(token, "az_AZ")
            // La decodificación de tokens se realiza por medio del método decode
        const { email } = jwt.decode(token)
            //        console.log(token)
        await deleteEvento(id)
        res.send(`El usuario ${email} ha eliminado el evento de id ${id}`)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.put('/eventos/:id', async(req, res) => {
    try {
        // Verify and decode token
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        // Check that the user has permission to update the event
        if (decoded.role !== "admin") {
            throw { code: 403, message: "Permission denied" };
        }
        // Update event
        await actualizarEvento(req.params.id, req.body);
        // Send success response
        res.status(200).send("Evento actualizado exitosamente");
    } catch (err) {
        // Handle errors
        if (err.code === 404) {
            res.status(404).send(err.message);
        } else if (err.code === 403) {
            res.status(403).send(err.message);
        } else {
            res.status(500).send("Error al actualizar evento");
        }
    }
});