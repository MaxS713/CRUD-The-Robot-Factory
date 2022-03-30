const express = require("express");

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/factory");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

const robotSchema = new mongoose.Schema({
  creatorName: String,
  robotName: String,
  imageNumber: String,
  date: String,
});

const LoginSchema = new mongoose.Schema({
  username: String,
  passcode: String,
});

const Robot = mongoose.model("robots", robotSchema);
const LoginInfo = mongoose.model("loginInfos", LoginSchema);

app.use("/login", (req, res) => {
  res.send({
    token: "test123",
  });
});

app.get("/get-all-robots", async (req, res) => {
  let allRobots = await Robot.find({});
  res.send(allRobots);
});

app.get("/get-all-users", async (req, res) => {
  let allUsers = await LoginInfo.find({});
  res.send(allUsers);
});

app.post("/add-robot", async (req, res) => {
  console.log("here")
  let robot = new Robot(req.body);
  let currentDate = new Date().toLocaleString();
  robot.save();
  await Robot.updateOne(
    { _id: robot._id },
    { $set: { date: currentDate } }
  );
});

app.post("/add-user", async (req, res) => {
  let user = new LoginInfo(req.body);
  user.save();
});

app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});
