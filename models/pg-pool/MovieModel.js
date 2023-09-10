import Pool from "pg-pool";

const config = {
    database: 'moviesdb',
    user: 'postgres',
    password: '1234',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 1000,
}

const pool = new Pool(config);

class MovieModel{
    static getAll = async ({ genre, page, limit }) => {
        const {rows} = await pool.query('SELECT * FROM pelicula');
        return rows
    }

    static #getGenre = async ({ genre }) => { }

    static #getpagination = async ({ page = 1, limit }) => { }

    static getById = async ({ id }) => { 
        const {rows} = await pool.query('SELECT * FROM pelicula WHERE id = $1', [id]);
        return rows[0]
    }

    static create = async ({ objMovie }) => { 
        const { title, director, duration, rate, year, poster } = objMovie
        const directorArray = director.split(' ')
        //Como tenemos 2 tablas, es importante recordar, que debemos primero insertar en la tabla director y luego en la tabla pelicula
        let cliente
        try {
            cliente = await pool.connect()
            // await cliente.query('BEGIN')
            const director = await cliente.query('INSERT INTO director (no_director, ap_director) VALUES ($1, $2) RETURNING id_director', [directorArray[0], directorArray[1]])

            const idDirector = director.rows[0].id_director

            const peliculaCreada = await cliente.query('INSERT INTO pelicula (ti_pelicula, ye_pelicula, ra_pelicula, id_director, po_pelicula, du_pelicula) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [title, year, rate, idDirector, poster, duration]) 

            console.log(peliculaCreada.rows)

            await cliente.query('COMMIT')
            return peliculaCreada.rows[0]

        } catch (error) {
            console.error(error)
            await cliente.query('ROLLBACK')
        } finally {
            if(cliente) cliente.release()
        }

    }
    
    static delete = async ({ id }) => { }

    static update = async ({ id, objMovie }) => { }
}

export default MovieModel


