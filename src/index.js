import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


const express = require("express");

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://MaxS713:nwcc4cJr0mTYpju4@cluster0.bgmkx.mongodb.net/factory"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));

app.use(cors());
app.use(express.json());

const robotSchema = new mongoose.Schema({
  creatorName: String,
  robotName: String,
  imageNumber: String,
  currentDate: String,
  health: Number,
  currentStatus: String,
  startedWork: Number,
});

const UserSchema = new mongoose.Schema({
  username: String,
  passcode: String,
  resources: Number,
  numberOfRobots: Number,
  beenAttacked: Boolean,
  byWhom: String,
  resourcesLost: Number,
});

const Robot = mongoose.model("robots", robotSchema);
const UserInfo = mongoose.model("UserInfos", UserSchema);

app.get("/get-all-robots", async (req, res) => {
  let allRobots = await Robot.find({});
  res.send(allRobots);
});

app.get("/get-all-users", async (req, res) => {
  let allUsers = await UserInfo.find({});
  res.send(allUsers);
});

app.get("/user/:username", async (req, res) => {
  let currentUser = await UserInfo.findOne(req.params);
  let currentTime = Date.now();
  let userRobotsGathering = await Robot.find({
    creatorName: req.params.username,
    currentStatus: "Gathering",
  });
  let userRobotsRepair = await Robot.find({
    creatorName: req.params.username,
    currentStatus: "Repairing",
  });
  if (userRobotsGathering.length !== 0) {
    let newAmountOfResources = 0;
    userRobotsGathering.forEach((gatherer) => {
      let totalTimeGathering = currentTime - gatherer.startedWork;
      let resourcesGathered = Math.floor(totalTimeGathering / 43200);
      if (resourcesGathered > 500) {
        resourcesGathered = 500;
      }
      newAmountOfResources = newAmountOfResources + resourcesGathered;
    });
    await Robot.updateMany(
      {creatorName: req.params.username, currentStatus: "Gathering"},
      {startedWork: currentTime}
    );
    let totalAmountOfResources = newAmountOfResources + currentUser.resources;
    currentUser.resources = totalAmountOfResources;
    await currentUser.save();
  }
  if (userRobotsRepair.length !== 0) {
    for (let repairer of userRobotsRepair) {
      await Robot.find(repairer);
      let totalTimeRepairing = currentTime - repairer.startedWork;
      let healthToAdd = Math.floor(totalTimeRepairing / 20000);
      let newHealth = repairer.health + healthToAdd;
      if (newHealth >= 100) {
        newHealth = 100;
        repairer.currentStatus = "Defending";
      }
      repairer.health = newHealth;
      repairer.startedWork = currentTime;
      await repairer.save();
    }
  }
  res.send(currentUser);
});

app.get("/combat/:user1/:user2", async (req, res) => {
  let user1 = await UserInfo.findOne({username: req.params.user1});
  let user2 = await UserInfo.findOne({username: req.params.user2});
  let robotsUser1 = await Robot.find({
    creatorName: req.params.user1,
    currentStatus: "Defending",
  });
  let robotsUser2 = await Robot.find({
    creatorName: req.params.user2,
    currentStatus: "Defending",
  });
  let randomFactor = Math.random();
  if (
    robotsUser1.length * randomFactor >=
    (robotsUser2.length + 1) * randomFactor
  ) {
    for (let robot of robotsUser1) {
      robot.health = robot.health - 25;
      await robot.save();
    }
    for (let robot of robotsUser2) {
      robot.health = robot.health - 50;
      await robot.save();
    }
    let newAmountOfResourcesUser1 = user1.resources + Math.floor(user2.resources / 2);
    let newAmountOfResourcesUser2 = Math.floor(user2.resources / 2);
    user1.resources = newAmountOfResourcesUser1;
    await user1.save();
    user2.resources = newAmountOfResourcesUser2;
    await user2.save();
    checkHealth();
    raidReport("lost");
    res.send(
      JSON.stringify({win: user1.username, resources: Math.floor(user2.resources / 2), robotsDefending: robotsUser2.length + 1})
    );
  } else {
    for (let robot of robotsUser2) {
      robot.health = robot.health - 25;
      await robot.save();
    }
    for (let robot of robotsUser1) {
      robot.health = robot.health - 50;
      await robot.save();
    }
    let newAmountOfResourcesUser2 = user2.resources + Math.floor(user1.resources / 2);
    let newAmountOfResourcesUser1 = Math.floor(user1.resources / 2);
    user2.resources = newAmountOfResourcesUser2;
    await user2.save();
    user1.resources = newAmountOfResourcesUser1;
    await user1.save();
    checkHealth();
    raidReport("win");
    res.send(
      JSON.stringify({win: user2.username, resources: Math.floor(user1.resources / 2), robotsDefending: robotsUser2.length + 1})
    );
  }
  async function checkHealth() {
    let allRobots = await Robot.find({});
    for (let robot of allRobots) {
      if (robot.health <= 0) {
        await Robot.deleteOne(robot);
        let currentUser = await UserInfo.findOne({username: robot.creatorName});
        let newNumberOfRobots = currentUser.numberOfRobots - 1;
        currentUser.numberOfRobots = newNumberOfRobots;
        currentUser.save();
      }
    }
  }
  async function raidReport(state) {
    user2.beenAttacked = true;
    user2.byWhom = user1.username;
    if (state === "lost") {
      user2.resourcesLost = user2.resources / 2;
    } else if (state === "win") {
      user2.resourcesLost = 0;
    }
    await user2.save();
  }
});

app.post("/add-robot", async (req, res) => {
  let robot = new Robot(req.body);
  let currentDate = new Date().toLocaleString();
  robot.currentDate = currentDate;
  robot.currentStatus = "Defending";
  robot.health = 100;
  await robot.save();
  let currentUser = await UserInfo.findOne({username: robot.creatorName});
  let newNumberOfRobots = currentUser.numberOfRobots + 1;
  let newAmountOfResources = currentUser.resources - 200;
  currentUser.numberOfRobots = newNumberOfRobots;
  currentUser.resources = newAmountOfResources;
  await currentUser.save();
});

app.post("/add-user", async (req, res) => {
  let user = new UserInfo(req.body);
  user.resources = 500;
  user.numberOfRobots = 0;
  await user.save();
});

app.post("/update-status", async (req, res) => {
  console.log(req.body.currentStatus)
  let currentRobot = await Robot.findOne({_id: req.body._id});
  currentRobot.currentStatus = req.body.currentStatus;
  if (
    req.body.currentStatus === "Gathering" ||
    req.body.currentStatus === "Repairing"
  ) {
    let currentTime = Date.now();
    currentRobot.startedWork = currentTime;
  }
  console.log(currentRobot)
  await currentRobot.save();
});

app.get("/notification-off/:username", async (req, res) => {
  let currentUser = await UserInfo.findOne(req.params);
  currentUser.beenAttacked = false;
  currentUser.save();
});

app.post("/delete-robot", async (req, res) => {
  await Robot.deleteOne(req.body);
  let currentUser = await UserInfo.findOne({username: req.body.creatorName});
  let newNumberOfRobots = currentUser.numberOfRobots - 1;
  let newAmountOfResources = currentUser.resources + 150;
  currentUser.numberOfRobots = newNumberOfRobots;
  currentUser.resources = newAmountOfResources;
  await currentUser.save();
});

app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});

module.exports = app;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

