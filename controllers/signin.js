const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  //if the values are not defined, do not add them to database
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }

  //getting email and hash from database
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
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
};

module.exports = {
  handleSignin: handleSignin,
};
