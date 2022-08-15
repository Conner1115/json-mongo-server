const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//configure express app
app.use(bodyParser.json());
app.use(cors());

// define schems
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  data: Object
});

const Data = mongoose.models.Data || mongoose.model("Data", dataSchema);

//configure mongoose
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});