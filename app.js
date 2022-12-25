//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const pg = require("pg");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

//connecting to the database
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.0",
    port: 5432,
    user: "komalkaur",
    password: "Whatever5",
    database: "smart-brain",
  },
});

var conString = "postgres://mehqshfl:V_9y498ZJoJtRhWHMQ9DIGP0h89S7kpJ@suleiman.db.elephantsql.com/mehqshfl" //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

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
app.post("/signin", signin.handleSignin(db, bcrypt));

//REGISTER ENDPOINT -> adds a new user to the database
app.post("/register", register.handleRegister(db, bcrypt));

//PROFILE HOME ENDPOINT -> checks each user in the database to return current user
app.get("/profile/:id", profile.handleProfileGet(db));

//IMAGE RANK ENDPOINT -> increases the entries if the current user detects a face with clarafai API
app.put("/image", image.handleImage(db));

//handles the api call to clarifai to protect our api key from frontend
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

//Run server on port 3004 and output running in terminal
port = 3004;
app.listen(port, "0.0.0.0", () => {
  console.log("running");
});
