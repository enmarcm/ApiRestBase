import { Router } from "express";
import MovieController from "../controllers/MovieController.js";

const createMovieRouter = ({ MovieModel }) => {
    const moviesRouter = Router();
    const movieController = new MovieController({ MovieModel })
    
    moviesRouter.get("/", movieController.getAll)
    
    moviesRouter.get("/:id", movieController.getByID);
    
    moviesRouter.post("/", movieController.create);
    
    moviesRouter.patch("/:id", movieController.update);
    
    moviesRouter.delete("/:id", movieController.delete);
    
    moviesRouter.options("/:id", movieController.options);

    return moviesRouter
}


export default createMovieRouter;


