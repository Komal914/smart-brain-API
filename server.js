//getting the libary
const express = require("express");
const bodyParser = require("body-parser");

//calling express on our application
const app = express();

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

//creating routes
app.get("/", (req, res) => {
  res.send("this is home");
});

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
