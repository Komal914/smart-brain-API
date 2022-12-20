//getting the libary
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
//calling express on our application
const app = express();

//body parser
app.use(bodyParser.json());

//cors, allow any sit to access the server
app.use(
  cors({
    origin: "*",
  })
);

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

//our database
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

//HOME ENDPOINT
app.get("/", (req, res) => {
  res.send(database.users);
});

//SIGNIN ENDPOINT
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

  //authentication
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Error logging in cutiepie");
  }
});

//REGISTER ENDPOINT
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  //returs the current user
  res.json(database.users[database.users.length - 1]);
});

//PROFILE HOME ENDPOINT
//user home page after loggin in
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

//IMAGE RANK ENDPOINT
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
  if (!found) {
    res.status(400).json("not found");
  }
});

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

//listening on our port
port = 3004;
app.listen(port, "0.0.0.0", () => {
  console.log("running");
});

/*
---------Our Endpoints-----------
/                --> this is home
/signin          --> POST = success/fail
/register        --> POST = user
/profile/:userID --> GET = user 
/image           --> PUT --> user 

*/
