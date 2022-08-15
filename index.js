require("dotenv").config();
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
  res.send("JSON MongoDB CRUD API");
});

app.post("/query", async (req, res) => {
  let outputObj = {};
  let [id, fields] = Object.entries(req.body)[0];
  let data = await Data.findOne({ _id: id });
  if (data) {
    for([key, value] of Object.entries(data.data)) {
      if(fields.split(",").includes(key)) {
        outputObj[key] = value;
      }
    }
    res.status(200).send(outputObj);
  }else{
    res.status(404).json({})
  }
  
});

app.post("/mutate", async (req, res) => {
  let data = await Data.findOne({ _id: req.body.id });
  let mutations = req.body.mutations;
  if (data) {
    Data.findByIdAndUpdate(req.body.id, { $set: Object.fromEntries(Object.entries(mutations).map(x => ["data." + x[0], x[1]])) }, { new: true }, (err, doc) => {
      if(err){
        res.status(500).json({})
        return;
      }
      res.json(doc.data);
    });
  }else{
    res.status(404).json({})
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});