/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work and completed based on my
* current understanding of the course concepts.
*
* The assignment was completed in accordance with:
* a. The Seneca's Academic Integrity Policy
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* b. The academic integrity policies noted in the assessment description
*
* I did NOT use generative AI tools (ChatGPT, Copilot, etc) to produce the code
* for this assessment.
*
* Name: Marsela Gjeka Student ID: 153019237
*
********************************************************************************/
const APP_PORT = process.env.PORT || 8080;

const expressLib = require("express");
const server = expressLib();
server.use(expressLib.static("public"));
server.set("view engine", "ejs");
server.use(expressLib.urlencoded({ extended: true }));

require("dotenv").config();
// +++ ORM setup
const { Sequelize: Orm, DataTypes: FieldTypes } = require("sequelize");
const db = new Orm(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: { ssl: { rejectUnauthorized: false } },
  }
);

// +++ Define your model (kept table named "Location")
const Memory = db.define(
  "Location",
  {
    name: FieldTypes.TEXT,
    address: FieldTypes.TEXT,
    category: FieldTypes.TEXT,
    comments: FieldTypes.TEXT,
    image: FieldTypes.TEXT,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// +++ Routes
server.get("/", async (req, res) => {
  try {
    const allEntries = await Memory.findAll();
    res.render("home.ejs", { locations: allEntries });
  } catch (error) {
    res.status(500).send("Error loading locations.");
  }
});

server.get("/memories/add", (req, res) => {
  res.render("add.ejs");
});

server.post("/memories/add", async (req, res) => {
  const { name, address, category, comments, image } = req.body;
  
  try {
    await Memory.create({ name, address, category, comments, image });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error saving location.");
  }
});

server.get("/memories/delete/:id", async (req, res) => {
  const entryId = req.params.id;
  try {
    await Memory.destroy({ where: { id: entryId } });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error deleting location.");
  }
});

// +++ Server start-up
async function initServer() {
  try {
    await db.authenticate();
    await db.sync();

    console.log("✔️  Database connected!");
    console.log(`🚀  Server listening on http://localhost:${APP_PORT}`);

    server.listen(APP_PORT);
  } catch (err) {
    console.error("❌  Failed to start:", err);
  }
}

initServer();
