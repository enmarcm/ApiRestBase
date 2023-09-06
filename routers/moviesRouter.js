import { Router } from "express";
import pc from "picocolors"
import importJSON from "../utils/importJSON.js";
import { randomUUID } from "node:crypto";
import { verifyMovie, verifyPartialMovie } from "../schemas/movieSchema.js";


const movies = importJSON("../movies.json");
const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
  console.log(pc.bgWhite(pc.black(`UN USUARIO HA PEDIDO PELICULAS`)));

  const { genre, limit, page } = req.query;
  if (genre) {
    const peliculas = movies.filter((movie) =>
      movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
    );
    return res.json(peliculas);
  }

  //AQUI PARA HACERLA POR PAGINACION
  const pagination = page ?? 1;
  if (limit) {
    const limitNumber = limit * pagination;

    const peliculasMostrar = movies.slice(limitNumber - limit, limitNumber);
    return res.json(peliculasMostrar);
  }

  res.json(movies);
});

moviesRouter.get("/:id", (req, res) => {
  console.log(pc.bgWhite(pc.black(`UN USUARIO HA PEDIDO UNA PELICULA`)));
  const { id } = req.params;

  const dato = movies.find((movie) => movie.id === id);
  if (dato) return res.json(dato);

  res
    .status(404)
    .set("content-type", "text?/html ; charset = utf-8")
    .end("<h1>404. NO SE Há ENCONTRADO</h1>");
});

moviesRouter.post("/", (req, res) => {
  const resultado = verifyMovie(req.body);

  if (!resultado.success)
    throw res.status(422).json(JSON.parse(resultado.error.message));

  //Esto se hara en BDD
  const objMovie = {
    id: randomUUID(),
    ...resultado.data, //Obtenemos todo el data aceptado
  };

  movies.push(objMovie);

  res.status(201).json(objMovie);
});

moviesRouter.patch("/:id", (req, res) => {
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

moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1)
    throw res.status(404).json({ message: "No se ha encontrado la pelicula" });

  movies.splice(movieIndex, 1);

  return res.status(200).end();
});

moviesRouter.options("/:id", (req, res) => {
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.status(200).end();
});

export default moviesRouter;
