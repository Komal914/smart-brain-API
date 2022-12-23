//IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const pg = require("pg");
const knex = require("knex");

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

//our manual database until we add postgres
const database = {
  users: [
    {
      id: "123",
      name: "john",
      password: "cookies",
      email: "john@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      password: "apples",
      email: "Sally@gmail.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: 123,
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

//HOME ENDPOINT -> displays the users in our manual database
app.get("/", (req, res) => {
  res.send(database.users);
});

//SIGNIN ENDPOINT -> the sign in log in: authenticates the user to log into their account to personalize their home
app.post("/signin", (req, res) => {
  //hash functions testing
  bcrypt.compare(
    "chocolate",
    "$2a$10$nXuSTteqYgS9nwidrC9WRuIzIklUsQ0BtbSZn2CRbnwndvxT6mVri",
    function (err, res) {
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "bacon",
    "$2a$10$nXuSTteqYgS9nwidrC9WRuIzIklUsQ0BtbSZn2CRbnwndvxT6mVri",
    function (err, res) {
      console.log("Second guess", res);
    }
  );

  //authentication: check if the user is in the database and returns the user
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Error logging in cutiepie");
  }
});

//REGISTER ENDPOINT -> adds a new user to the database
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      name: name,
      email: email,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("Unable to register"));
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
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  //if the user is not in database
  if (!found) {
    res.status(400).json("not found");
  }
});

//Run server on port 3004 and output running in terminal
port = 3004;
app.listen(port, "0.0.0.0", () => {
  console.log("running");
});
