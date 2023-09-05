const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    required_error: "El titulo es obligatorio",
    invalid_type_error: "El titulo debe ser un string",
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().positive().min(0).max(10),
  poster: z.string().url(),
  genre: z.array(
    z.enum(
      [
        "Action",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
      ],
      {
        invalid_type_error: "El genero debe ser un string",
        required_error: "El genero es obligatorio",
      },
      {
        invalid_type_error: "Debe ser un array",
      }
    )
  ),
});

const verifyMovie = (obj) => movieSchema.safeParse(obj);

const verifyPartialMovie = (obj) => movieSchema.partial().safeParse(obj)

module.exports = {
  verifyMovie,
  verifyPartialMovie
};
