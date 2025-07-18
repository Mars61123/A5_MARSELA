const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms

require("dotenv").config() 
//Vercel required code
app.set('views', __dirname + '/views');  
require('pg');

// +++ Database connection code
// +++ TODO: Remember to add your Neon.tech connection variables to the .env file!!
const { Sequelize } = require("sequelize")
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// +++  4. TODO: Define your database table




// +++ 5. TODO: Define your server routes
app.get("/", (req, res) => {    
    return res.render("home.ejs")
})
app.get("/memories/add", (req, res) => {    
    return res.render("add.ejs")
})

// +++  Function to start serer
async function startServer() {
    
    try {            
        await sequelize.authenticate();        
        await sequelize.sync()

        console.log("SUCCESS connecting to database")
        console.log("STARTING Express web server")        
        
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }    
    catch (err) {        
        console.log("ERROR: connecting to database")        
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}

startServer()



