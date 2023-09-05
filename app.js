const express = require("express");
const pc = require("picocolors");
const movies = require("./movies.json");
const crypto = require("node:crypto");
const { verifyMovie, verifyPartialMovie } = require("./schemas/movieSchema.js");

const PORT = process.env.PORT ?? 1234;

const app = express();
app.use(express.json());
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next() 
})

app.get("/", (req, res) => {
  console.log(pc.bgWhite(pc.black(`PETICION DESDE ${req.url}`)));
  res
    .set("content-type", "text/html ; charset=utf-8")
    .end("PAGINA PRINCIPAL</h1>");
});

// PARA DEVOLVER TODAS LAS PELICULAS
app.get("/movies", (req, res) => {
  console.log(pc.bgWhite(pc.black(`UN USUARIO HA PEDIDO PELICULAS`)));

  const { genre , limit, page} = req.query;
  if (genre) {
    const peliculas = movies.filter((movie) =>
      movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
    );
    return res.json(peliculas);
  }

  //AQUI PARA HACERLA POR PAGINACION
  const pagination = page ?? 1 
  if (limit) {
    const limitNumber = limit * pagination

    const peliculasMostrar = movies.slice(limitNumber - limit, limitNumber)
    return res.json(peliculasMostrar)
  }

  res.json(movies);
});


// PARA DEVOLVER UNA PELICULA POR SU ID
app.get("/movies/:id", (req, res) => {
  console.log(pc.bgWhite(pc.black(`UN USUARIO HA PEDIDO UNA PELICULA`)));
  const { id } = req.params;

  const dato = movies.find((movie) => movie.id === id);
  if (dato) return res.json(dato);

  res
    .status(404)
    .set("content-type", "text?/html ; charset = utf-8")
    .end("<h1>404. NO SE Há ENCONTRADO</h1>");
});

// PARA CREAR UNA PELICULA
app.post("/movies", (req, res) => {
  const resultado = verifyMovie(req.body);

  if (!resultado.success)
    throw res.status(422).json(JSON.parse(resultado.error.message));

  //Esto se hara en BDD
  const objMovie = {
    id: crypto.randomUUID(),
    ...resultado.data, //Obtenemos todo el data aceptado
  };

  movies.push(objMovie);

  res.status(201).json(objMovie);
});

//ACTUALIZAR UNA PARTE DE UNA PELICULA
app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const resultado = verifyPartialMovie(req.body);

  if (!resultado.success)
    throw res.status(422).json(JSON.parse(resultado.error.message));

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1)
    throw res.status(404).json({ message: "No se ha encontrado la pelicula" });

  const movie = {
    ...movies[movieIndex],
    ...resultado.data,
  };

  movies[movieIndex] = movie;

  res.status(202).json(movie);
});

app.delete("/movies/:id", (req, res) => {
  const {id} = req.params

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) throw res.status(404).json({message: "No se ha encontrado la pelicula"})

  movies.splice(movieIndex, 1)

  return res.status(200).end()
})


app.options("/movies/:id", (req, res) => { 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.status(200).end()
})

app.use((req, res) => {
  res
    .status(404)
    .set("content-type", "text/plane ; charset=utf-8")
    .end("<h1>404. NO SE Há ENCONTRADO</h1>");
});

app.listen(PORT, () => {
  console.log(pc.bgMagenta(`SERVIDOR INICIADO EN  http://localhost:${PORT}`));
});
