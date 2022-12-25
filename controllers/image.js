const Clarifai = require("clarifai");

//our face detection API
const app = new Clarifai.App({
  apiKey: "7523494fd75c4a70b1f43a9bd6ccc4b1",
});

const handleApiCall = (req, res) => {
  try{
     app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
  }catch (error) {
    throw error
    console.log("unable to work with clarifai api");
    res.status(400).json("error with Clarifai");
  }
}

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  try{
  db("users")
  .where("id", "=", id)
  .increment("entries", 1)
  .returning("entries")
  .then((entries) => {
    res.json(entries[0].entries);
  })} catch (error) {
    throw error 
    console.log("unable to get entries");
    res.status(400).json("error with entries");
  }
};

module.exports = {
  handleImage,
  handleApiCall,
};
