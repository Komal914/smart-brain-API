const Clarifai = require("clarifai");

//our face detection API
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API,
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json("FACE DETECTION MODEL: unable to work with API ");
    });
};

const handleDescriptionApiCall = (req, res) => {
  app.models
    .predict(Clarifai.GENERAL_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json("GENERAL MODEL: unable to work with API ");
    });
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((error) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
  handleDescriptionApiCall,
};
