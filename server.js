//getting the libary
const express = require("express");
const bodyParser = require("body-parser");

//calling express on our application
const app = express();

//body parser
app.use(bodyParser.json());

//our database
const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "Sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

//HOME
app.get("/", (req, res) => {
  res.send(database.users);
});

//SIGNIN
app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error loggin in ");
  }
});

//REGISTER
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

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
    res.status(404).json("no such user");
  }
});

//listening on our port
app.listen(3001, () => {
  console.log("i am running");
});

/*
---------Our Endpoints-----------
/                --> this is home
/signin          --> POST = success/fail
/register        --> POST = user
/profile/:userID --> GET = user 
/image           --> PUT --> user 

*/
