const Sequelize = require("sequelize");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";

const db = new Sequelize(databaseUrl);

db.sync({ force: true }) // NOTE: --> use if want to delete db on heroku. Deploy again with sync()
  //db.sync()
  .then(() => console.log("Database schema updated"))
  .catch(console.error);

// Define Data Model Movie
const Movie = db.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});
