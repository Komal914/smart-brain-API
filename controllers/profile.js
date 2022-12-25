const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params;
  //get all the users and send the user requested
  try{
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
  } catch(error) {
    throw error
    res.status(400).json("error getting user");
  } 
};

module.exports = {
  handleProfileGet,
};
