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

//HOME ENDPOINT -> displays the users in our manual database
app.get("/", (req, res) => {
  //res.send(database.users);
});

//SIGNIN ENDPOINT -> the sign in log in: authenticates the user to log into their account to personalize their home
app.post("/signin", (req, res) => {
  //getting email and hash from database
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      //if the user login info matches the request body
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            console.log(user);
            res.json(user[0]);
          })
          .catch((err) => {
            res.status(400).json("unable to get user");
          });
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => {
      res.status(400).json("wrong credentials");
    });
});

//REGISTER ENDPOINT -> adds a new user to the database
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  //transaction forces both to fail if one fails to avoid inconsitentsies in users and logins
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginemail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginemail[0].email,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).json("Unable to register");
  });
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
