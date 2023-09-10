import express, { json } from "express";
import pc from "picocolors";
import { midCorsCompleto, midNotFound } from "./middlewares/middlewares.js";
import createMovieRouter from "./routers/moviesRouter.js";

// *No lo usamos en vista de que ahora lo manera el createApp
// import MovieModel from "./models/pg-pool/MovieModel.js";

//Importar los JSON
//* Opcion 1 - Asi no sera, en cualquier momento deja de tener soporte
//  import movies from "./movies.json" assert {type: 'json'};

//* Opcion 2 - Asi sera, pero aun no tiene soporte
//  import movies from "./movies.json" with {type: 'json'};

//* Opcion 3 - Con File System
//  import { readFileSync } from "node:fs";
//  const movies = JSON.parse(readFileSync("./movies.json", "utf-8"));

//* Opcion 4 - Creando un require
// import { createRequire } from "node:module";
// import moviesRouter from "./routers/moviesRouter.js";
// const require = createRequire(import.meta.url);
// const movies = require("./movies.json");

const createApp = ({ MovieModel }) => {
  const PORT = process.env.PORT ?? 1234;

  const app = express();
  app.use(json());
  app.disable("x-powered-by");

  app.use(midCorsCompleto);

  app.get("/", (req, res) => {
    console.log(pc.bgWhite(pc.black(`PETICION DESDE ${req.url}`)));
    res
      .set("content-type", "text/html ; charset=utf-8")
      .end("PAGINA PRINCIPAL</h1>");
  });

  app.use("/movies", createMovieRouter({ MovieModel }));

  app.use(midNotFound);

  app.listen(PORT, () => {
    console.log(pc.bgMagenta(`SERVIDOR INICIADO EN  http://localhost:${PORT}`));
  });

  return app;
};

export default createApp;
