const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = require("express")();
const {v4} = require("uuid");

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

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
  const {slug} = req.params;
  res.end(`Item: ${slug}`);
});

app.get("/api/get-all-robots", async (req, res) => {
  let allRobots = await Robot.find({});
  res.send(allRobots);
});

app.get("/api/get-all-users", async (req, res) => {
  let allUsers = await UserInfo.find({});
  res.send(allUsers);
});

app.get("/api/user/:username", async (req, res) => {
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
  let allUsersRobots = await Robot.find({
    creatorName: req.params.username,
  });
  for (let robot of allUsersRobots) {
    if (robot.health <= 0 && robot.currentStatus !== "Repairing") {
      robot.currentStatus = "Broken";
      await robot.save();
    }
  }
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

app.get("/api/combat/:user1/:user2", async (req, res) => {
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
    let newAmountOfResourcesUser1 =
      user1.resources + Math.floor(user2.resources / 2);
    let newAmountOfResourcesUser2 = Math.floor(user2.resources / 2);
    user1.resources = newAmountOfResourcesUser1;
    await user1.save();
    user2.resources = newAmountOfResourcesUser2;
    await user2.save();
    raidReport("lost");
    res.send(
      JSON.stringify({
        win: user1.username,
        resources: Math.floor(user2.resources / 2),
        robotsDefending: robotsUser2.length + 1,
      })
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
    let newAmountOfResourcesUser2 =
      user2.resources + Math.floor(user1.resources / 2);
    let newAmountOfResourcesUser1 = Math.floor(user1.resources / 2);
    user2.resources = newAmountOfResourcesUser2;
    await user2.save();
    user1.resources = newAmountOfResourcesUser1;
    await user1.save();
    raidReport("win");
    res.send(
      JSON.stringify({
        win: user2.username,
        resources: Math.floor(user1.resources / 2),
        robotsDefending: robotsUser2.length + 1,
      })
    );
  }
  async function raidReport(state) {
    user2.beenAttacked = true;
    user2.byWhom = user1.username;
    if (state === "lost") {
      user2.resourcesLost = Math.floor(user2.resources / 2);
    } else if (state === "win") {
      user2.resourcesLost = 0;
    }
    await user2.save();
  }
});

app.post("/api/add-robot", async (req, res) => {
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

app.post("/api/add-user", async (req, res) => {
  let user = new UserInfo(req.body);
  user.resources = 500;
  user.numberOfRobots = 0;
  await user.save();
});

app.post("/api/update-status", async (req, res) => {
  let currentRobot = await Robot.findOne({_id: req.body._id});
  currentRobot.currentStatus = req.body.currentStatus;
  if (
    req.body.currentStatus === "Gathering" ||
    req.body.currentStatus === "Repairing"
  ) {
    let currentTime = Date.now();
    currentRobot.startedWork = currentTime;
  }
  await currentRobot.save();
});

app.get("/api/notification-off/:username", async (req, res) => {
  let currentUser = await UserInfo.findOne(req.params);
  currentUser.beenAttacked = false;
  currentUser.save();
});

app.post("/api/delete-robot", async (req, res) => {
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
