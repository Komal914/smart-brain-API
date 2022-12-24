//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const pg = require("pg");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");

//connecting to the database
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "komalkaur",
    password: "Whatever5",
    database: "smart-brain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

/*
---------Our Endpoints-----------
/                --> this is home
/signin          --> POST = success/fail
/register        --> POST = user
/profile/:userID --> GET = user 
/image           --> PUT --> user 

*/

//calling express on our application
const app = express();

//adding body parser to the app, we need to parse our data to json
app.use(bodyParser.json());

//cors, allow any site to access the server
//allows the server to indicate any origins, (domain, scheme, port)
app.use(
  cors({
    origin: "*",
  })
);

//setting the header controls
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
    "Access-Control-Allow-Origin"
  );
  next();
});

//HOME ENDPOINT -> displays the users in our manual database
app.get("/", (req, res) => {
  //res.send(database.users);
});

//SIGNIN ENDPOINT -> the sign in log in: authenticates the user to log into their account to personalize their home
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

//REGISTER ENDPOINT -> adds a new user to the database
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//PROFILE HOME ENDPOINT -> checks each user in the database to return current user
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  //get all the users and send the user requested
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not Found");
      }
    })
    .catch((err) => {
      res.status(400).json("error getting user");
    });
});

//IMAGE RANK ENDPOINT -> increases the entries if the current user detects a face with clarafai API
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((error) => res.status(400).json("unable to get entries"));
});

//Run server on port 3004 and output running in terminal
port = 3004;
app.listen(port, "0.0.0.0", () => {
  console.log("running");
});
