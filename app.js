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
    host: process.env.DATABASE_URL,
    ssl: true,
  },
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
  res.send("it is working!");
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
app.listen(process.env.PORT || 3004, "0.0.0.0", () => {
  console.log(`running on ${process.env.PORT} `);
});
