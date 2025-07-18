const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  
app.set("view engine", "ejs");      // ejs
app.use(express.urlencoded({ extended: true })); // forms

require("dotenv").config();
// Vercel required code
app.set("views", __dirname + "/views");
require("pg");

// +++ Database connection code
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

// +++ 4. Define your database table
const Location = sequelize.define(
  "Location",
  {
    name: DataTypes.TEXT,
    address: DataTypes.TEXT,
    category: DataTypes.TEXT,
    comments: DataTypes.TEXT,
    image: DataTypes.TEXT,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// +++ 5. Define your server routes
app.get("/", async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.render("home.ejs", { locations });
  } catch (err) {
    res.status(500).send("Error loading locations.");
  }
});

app.get("/memories/add", (req, res) => {
  res.render("add.ejs");
});


// POST route to add a new memory
app.post("/memories/add", async (req, res) => {
  const { name, address, category, comments, image } = req.body;

  try {
    await Location.create({
      name,
      address,
      category,
      comments,
      image,
    });

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error saving location.");
  }
});

// GET route to delete a memory by id
app.get("/memories/delete/:id", async (req, res) => {
  const locationId = req.params.id;

  try {
    await Location.destroy({
      where: { id: locationId },
    });

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting location.");
  }
});

// +++  Function to start server
async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("SUCCESS connecting to database");
    console.log("STARTING Express web server");

    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: http://localhost:${HTTP_PORT}`);
    });
  } catch (err) {
    console.log("ERROR: connecting to database");
    console.log(err);
    console.log("Please resolve these errors and try again.");
  }
}

startServer();
