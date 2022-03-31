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

const robotSchema = new mongoose.Schema({
  creatorName: String,
  robotName: String,
  currentStatus: String,
  startedWork: Date,
  imageNumber: String,
  date: String,
});

const UserSchema = new mongoose.Schema({
  username: String,
  passcode: String,
  resources: Number,
  numberOfRobots: Number,
});

const Robot = mongoose.model("robots", robotSchema);
const UserInfo = mongoose.model("UserInfos", UserSchema);

app.get("/get-all-robots", async (req, res) => {
  console.log("1")
  let allRobots = await Robot.find({});
  res.send(allRobots);
});

app.get("/get-all-users", async (req, res) => {
  console.log("2")
  let allUsers = await UserInfo.find({});
  res.send(allUsers);
});

app.get("/user/:username", async (req, res) => {
  let user = await UserInfo.findOne(req.params);
  let userRobots = await Robot.find({creatorName: req.params.username});

  console.log(userRobots)
  res.send(user);
});

app.post("/add-robot", async (req, res) => {
  let robot = new Robot(req.body);
  let currentDate = new Date().toLocaleString();
  robot.save();
  await Robot.updateOne({_id: robot._id}, {$set: {date: currentDate}});
  await Robot.updateOne({_id: robot._id}, {$set: {currentStatus: "Defending"}});
  let currentUser = await UserInfo.findOne({username: robot.creatorName});
  let newNumberOfRobots = currentUser.numberOfRobots + 1;
  let newAmountOfResources = currentUser.resources - 200;
  await UserInfo.updateOne(
    {username: robot.creatorName},
    {$set: {numberOfRobots: newNumberOfRobots}}
  );
  await UserInfo.updateOne(
    {username: robot.creatorName},
    {$set: {resources: newAmountOfResources}}
  );
});

app.post("/add-user", async (req, res) => {
  let user = new UserInfo(req.body);
  user.save();
  await UserInfo.updateOne({_id: user._id}, {$set: {resources: 500}});
  await UserInfo.updateOne({_id: user._id}, {$set: {numberOfRobots: 0}});
});

app.post("/update-status", async (req, res) => {
  await Robot.updateOne(
    {_id: req.body._id},
    {$set: {currentStatus: req.body.currentStatus}}
  );
});

app.post("/delete-robot", async (req, res) => {
  await Robot.deleteOne(req.body);
  let currentUser = await UserInfo.findOne({username: req.body.creatorName});
  let newNumberOfRobots = currentUser.numberOfRobots - 1;
  let newAmountOfResources = currentUser.resources + 200;
  await UserInfo.updateOne(
    {username: req.body.creatorName},
    {$set: {numberOfRobots: newNumberOfRobots}}
  );
  await UserInfo.updateOne(
    {username: req.body.creatorName},
    {$set: {resources: newAmountOfResources}}
  );
});

app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});

let date = new Date()
console.log(date)
console.log(typeof date)