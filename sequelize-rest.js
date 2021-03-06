const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const databaseUrl = "postgres://postgres:secret@localhost:5432/postgres";

const app = express();
const port = 4000;
const db = new Sequelize(databaseUrl);

// Define Data Model - Movie
const Movie = db.define("movie", {
  title: Sequelize.TEXT,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.TEXT
});

db.sync()
  .then(() => {
    // Example Data
    // Instead of using the create() method, which I have to apply three times, I chose to use the method bulkCreate() to insert three rows at once.
    Movie.bulkCreate([
      {
        title: "Beauty and the Beast",
        yearOfRelease: 2019,
        synopsis:
          "Beauty and the Beast focuses on the relationship between the Beast, a prince who is magically transformed into a monster and his servants into household objects as punishment for his arrogance, and Belle, a young woman whom he imprisons in his castle to become a prince again. To break the curse, Beast must learn to love Belle and earn her love in return before the last petal falls from an enchanted rose or else the Beast will remain a monster forever."
      },
      {
        title: "Frozen",
        yearOfRelease: 2013,
        synopsis:
          "Frozen tells the story of a fearless princess who sets off on a journey alongside a rugged iceman, his loyal reindeer, and a naive snowman to find her estranged sister, whose icy powers have inadvertently trapped their kingdom in eternal winter."
      },
      {
        title: "Moana",
        yearOfRelease: 2016,
        synopsis:
          "The film tells the story of Moana, the strong-willed daughter of a chief of a Polynesian village, who is chosen by the ocean itself to reunite a mystical relic with the goddess Te Fiti. When a blight strikes her island, Moana sets sail in search of Maui, a legendary demigod, in the hope of returning the relic to Te Fiti and saving her people."
      }
    ]);
  })
  .catch(err => {
    console.error("Unable to create tables, shutting down...", err);
    process.exit(1);
  });

// Middleware
app.use(bodyParser.json());

// Create a new movie resource
app.post("/movies", (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(next);
});

// Read all movies without pagination - Left in as a comment for evaluation
// app.get("/movies", (req, res, next) => {
//   Movie.findAll()
//     .then(movies => {
//       res.json(movies);
//     })
//     .catch(next);
// });

// Read all movies with pagination (limit set on 10 movies)
app.get("/movies", (req, res, next) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ movies: result.rows, total: result.count }))
    .catch(error => next(error));
});

// Read a single movie resource
app.get("/movies/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Update a single movie resource
app.put("/movies/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        movie.update(req.body).then(movie => res.json(movie));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete a single movie resource
app.delete("/movies/:id", (req, res, next) => {
  Movie.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

app.listen(port, () => console.log("listening on port " + port));
