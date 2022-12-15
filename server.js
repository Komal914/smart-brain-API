//getting the libary
const express = require("express");

//calling express on our application
const app = express();

//creating routes
app.get("/", (req, res) => {
  res.send("this is home");
});

//listening on our port
app.listen(3000, () => {
  console.log("i am running");
});
