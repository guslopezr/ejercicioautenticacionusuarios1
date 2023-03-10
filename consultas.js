const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'vida_sana',
    allowExitOnIdle: true
})

const getEventos = async() => {
    const { rows: eventos } = await pool.query("SELECT * FROM eventos")
    return eventos
}

const deleteEvento = async(id) => {
    const consulta = "DELETE FROM eventos WHERE id = $1"
    const values = [id]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount) throw { code: 404, message: "No se encontró ningún evento con este ID" }
}

const verificarCredenciales = async(email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)

    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }

}

const actualizarEvento = async(id, data) => {
    try {
        // Input validation
        if (!id || !data || !data.titulo || !data.descripcion || !data.fecha || !data.lugar) {
            throw { code: 400, message: "Missing required fields" };
        }
        // Start transaction
        await pool.query('BEGIN');
        const consulta = "UPDATE eventos SET titulo = $1, descripcion = $2, fecha = $3, lugar = $4 WHERE id = $5"
        const values = [data.titulo, data.descripcion, data.fecha, data.lugar, id]
        const { rowCount } = await pool.query(consulta, values)
            // Commit transaction
        await pool.query('COMMIT')
        if (!rowCount) throw { code: 404, message: "No se encontró ningún evento con este ID" }
        return rowCount;
    } catch (err) {
        // Handle errors
        await pool.query('ROLLBACK')
        if (err.code === 400) {
            throw { code: 400, message: err.message }
        } else if (err.code === 404) {
            throw { code: 404, message: err.message }
        } else {
            throw { code: 500, message: "Error al actualizar evento" }
        }
    }
}

const registrarUsuario = async(usuario) => {
    let { email, password } = usuario
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [email, passwordEncriptada]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2)"
    await pool.query(consulta, values)
}



module.exports = { getEventos, deleteEvento, verificarCredenciales, actualizarEvento, registrarUsuario }