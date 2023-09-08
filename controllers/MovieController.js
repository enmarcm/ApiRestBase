import { verifyMovie, verifyPartialMovie } from "../schemas/movieSchema.js";
import MovieModel from "../models/MovieModel.js";
import pc from "picocolors";


class MovieController {
  static getAll = async (req, res) => {
    console.log(pc.bgWhite(pc.black(`UN USUARIO HA PEDIDO PELICULAS`)));

    const { genre, limit, page } = req.query;

    const movies = await MovieModel.getAll({ genre, limit, page });

    res.json(movies);
  };

  static getByID = async (req, res) => {
    console.log(pc.bgWhite(pc.black(`UN USUARIO HA PEDIDO UNA PELICULA`)));
    const { id } = req.params;

    const dato = await MovieModel.getById({ id });
    if (dato) return res.json(dato);

    res
      .status(404)
      .set("content-type", "text/html ; charset = utf-8")
      .end("<h1>404. NO SE HA ENCONTRADO ESE ID</h1>");
  };

  static create = async (req, res) => {
    const resultado = verifyMovie(req.body);

    if (!resultado.success)
      throw res.status(422).json(JSON.parse(resultado.error.message));

    const objMovie = await MovieModel.create({ objMovie: resultado.data });

    res.status(201).json(objMovie);
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const resultado = verifyPartialMovie(req.body);


    if (!resultado.success)
      throw res.status(422).json(JSON.parse(resultado.error.message));

    const movie = await MovieModel.update({ id, objMovie: resultado.data });

    if (!movie) {
      return res
        .status(404)
        .json({ message: "No se ha encontrado la pelicula" });
    }

    res.status(202).json(movie);
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const result = await MovieModel.delete({ id });

    if (!result)
      throw res
        .status(404)
        .json({ message: "No se ha encontrado la pelicula" });

    return res.json({ message: "Pelicula borrada correctamente" });
  };

  static options = async (req, res) => {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    res.status(200).end();
  };
}

export default MovieController;
