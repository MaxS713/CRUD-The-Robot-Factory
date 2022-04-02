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
  let userRobotsGathering = await Robot.find({
    creatorName: req.params.username,
    currentStatus: "Gathering",
  });
  if (userRobotsGathering.length !== 0) {
    let currentTime = Date.now();
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
  if (robotsUser1.length * randomFactor >= robotsUser2.length * randomFactor) {
    for (let robot of robotsUser1) {
      robot.health = robot.health - 25;
      await robot.save();
    }
    for (let robot of robotsUser2) {
      await Robot.updateOne(
        {_id: robot._id},
        {$set: {health: robot.health - 50}}
      );
    }
    let newAmountOfResourcesUser1 = user1.resources + user2.resources / 2;
    let newAmountOfResourcesUser2 = user2.resources / 2;
    await UserInfo.updateOne(user1, {
      $set: {resources: newAmountOfResourcesUser1},
    });
    await UserInfo.updateOne(user2, {
      $set: {resources: newAmountOfResourcesUser2},
    });
    checkHealth();
    raidReport();
    res.send({win: user1, resources: user2.resources / 2});
  } else {
    for (let robot of robotsUser2) {
      await Robot.updateOne(robot, {$set: {health: robot.health - 25}});
    }
    for (let robot of robotsUser1) {
      await Robot.updateOne(robot, {$set: {health: robot.health - 50}});
    }
    let newAmountOfResourcesUser2 = user2.resources + user1.resources / 2;
    let newAmountOfResourcesUser1 = user1.resources / 2;
    await UserInfo.updateOne(
      {_id: user2._id},
      {
        $set: {resources: newAmountOfResourcesUser2},
      }
    );
    await UserInfo.updateOne(
      {_id: user1._id},
      {
        $set: {resources: newAmountOfResourcesUser1},
      }
    );
    checkHealth();
    raidReport();
    res.send({win: user2, resources: user1.resources / 2});
  }
  async function checkHealth() {
    let allRobots = await Robot.find({});
    for (let robot of allRobots) {
      if (robot.health <= 0) {
        await Robot.deleteOne(robot);
        let currentUser = await UserInfo.findOne({username: robot.creatorName});
        let newNumberOfRobots = currentUser.numberOfRobots - 1;
        await UserInfo.updateOne(
          {username: robot.creatorName},
          {$set: {numberOfRobots: newNumberOfRobots}}
        );
      }
    }
  }
  async function raidReport() {
    await UserInfo.updateOne({_id: user2._id}, {$set: {beenAttacked: true}});
    await UserInfo.updateOne(
      {_id: user2._id},
      {$set: {byWhom: user1.username}}
    );
    await UserInfo.updateOne(
      {_id: user2._id},
      {
        $set: {resourcesLost: user2.resources / 2},
      }
    );
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
  let currentRobot = await Robot.findOne({_id: req.body._id});
  currentRobot.currentStatus = req.body.currentStatus;
  if (req.body.currentStatus === "Gathering") {
    let currentTime = Date.now();
    currentRobot.startedWork = currentTime;
  }
  await currentRobot.save();
});

app.post("/notification-off/:username", async (req, res) => {
  let currentUser = await UserInfo.findOne(req.params);
  currentUser.beenAttacked = false;
  currentUser.save()
});

app.post("/delete-robot", async (req, res) => {
  await Robot.deleteOne(req.body);
  let currentUser = await UserInfo.findOne({username: req.body.creatorName});
  let newNumberOfRobots = currentUser.numberOfRobots - 1;
  let newAmountOfResources = currentUser.resources + 200;
  currentUser.numberOfRobots = newNumberOfRobots
  currentUser.resources = newAmountOfResources
  await currentUser.save();
});

app.listen(port, () => {
  console.log("Now listening on http://localhost:" + port);
});
