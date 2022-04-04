import React, {useState, useEffect} from "react";
import CreateNewRobotModal from "./CreateRobot";
import DeleteRobotModal from "./DeleteRobot";
import CombatModal from "./Combat";
import StatusModal from "./Status";
import NotificationModal from "./NotificationModal";
import ResourcesNotificationModal from "./ResourcesNotificationModal";
import RobotsNotificationModal from "./RobotsNotificationModal";
import NoRobotsNotificationModal from "./NoRobotsNotificationModal";
import PhoneNotificationModal from "./RotatePhoneNotif";
import ProgressBar from "./ProgressBar";
import Gear from "../images/gear.png";
import "./Dashboard.css";

function Dashboard() {
  let params = new URLSearchParams(document.location.search);
  let activeUser = params.get("username");

  const [currentUserData, setCurrentUserData] = useState([]);
  const [robotData, setRobotData] = useState([]);
  const [userDatabase, setUserDatabase] = useState([]);
  const [selectedRobotID, setSelectedRobotID] = useState("");
  const [selectedRobotName, setSelectedRobotName] = useState("");
  const [selectedRobotStatus, setSelectedRobotStatus] = useState("");

  let allUserDataOrderedArray = [];
  let allUsernamesArray = [];
  let allRobotsAmountArray = [];
  let allResourcesAmountArray = [];
  let numberOfDefendingRobots = 0;

  let allRobotsArray = [];
  let allStatusArray = [];

  async function getRobots() {
    let allRobots = await fetch("api/get-all-robots");
    allRobots = await allRobots.json();
    setRobotData(allRobots);
  }
  useEffect(() => {
    getRobots();
  }, []);

  async function getUsers() {
    let allUsers = await fetch("api/get-all-users");
    allUsers = await allUsers.json();
    setUserDatabase(allUsers);
  }
  useEffect(() => {
    getUsers();
  }, []);

  async function getCurrentUserInfo() {
    let userData = await fetch(`api/user/${activeUser}`);
    userData = await userData.json();
    setCurrentUserData(userData);
  }
  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  userDatabase.forEach((user) => {
    allUserDataOrderedArray.push(user);
  });
  allUserDataOrderedArray.sort((a, b) => b.numberOfRobots - a.numberOfRobots);

  allUserDataOrderedArray.forEach((user) => {
    allUsernamesArray.push(user.username);
    allRobotsAmountArray.push(user.numberOfRobots);
    allResourcesAmountArray.push(user.resources);
  });
  let currentUserIndex = allUsernamesArray.indexOf(activeUser);

  robotData.forEach((robot) => {
    if (robot.creatorName === activeUser) {
      allRobotsArray.push(robot.robotName);
      allStatusArray.push(robot.currentStatus);
    }
    if (robot.currentStatus === "Defending"){
      numberOfDefendingRobots++
    }
  });

  const [resourcesNotificationModalState, setResourcesNotificationModalState] =
    useState(false);
  const [createRobotModalState, setCreateRobotModalState] = useState(false);
  function handleClickCreateRobot() {
    if (
      currentUserData.resources < 200 &&
      resourcesNotificationModalState === true
    ) {
      setResourcesNotificationModalState(false);
    } else if (currentUserData.resources < 200) {
      setResourcesNotificationModalState(true);
    } else if (createRobotModalState === true) {
      setCreateRobotModalState(false);
    } else {
      setCreateRobotModalState(true);
    }
  }

  const [robotsNotificationModalState, setRobotsNotificationModalState] =
    useState(false);
  const [deleteRobotModalState, setDeleteRobotModalState] = useState(false);
  function handleClickDeleteRobot() {
    if (
      currentUserData.numberOfRobots === 0 &&
      robotsNotificationModalState === true
    ) {
      setRobotsNotificationModalState(false);
    } else if (currentUserData.numberOfRobots === 0) {
      setRobotsNotificationModalState(true);
    } else if (deleteRobotModalState === true) {
      setDeleteRobotModalState(false);
    } else {
      setDeleteRobotModalState(true);
    }
  }

  const [noRobotsNotificationModalState, setNoRobotsNotificationModalState] =
    useState(false);
  const [combatModalState, setCombatModalState] = useState(false);
  function handleClickCombat() {
    if (
      numberOfDefendingRobots === 0 &&
      noRobotsNotificationModalState === true
    ) {
      setNoRobotsNotificationModalState(false);
    } else if (numberOfDefendingRobots === 0) {
      setNoRobotsNotificationModalState(true);
    } else if (combatModalState === true) {
      setCombatModalState(false);
    } else {
      setCombatModalState(true);
    }
  }

  const [statusModalState, setStatusModalState] = useState(false);
  function handleClickStatus(event) {
    if (statusModalState === true) {
      setStatusModalState(false);
    } else {
      setSelectedRobotID(event.target.id);
      setSelectedRobotName(event.target.name);
      setSelectedRobotStatus(event.target.status);
      setStatusModalState(true);
    }
  }

  const [raidNotificationModalState, setRaidNotificationModalState] =
    useState(false);
  useEffect(() => {
    if (currentUserData.beenAttacked === true) {
      setRaidNotificationModalState(true);
    }
  }, [currentUserData.beenAttacked]);

  return (
    <main>
      <div id="header">
        <h1>Welcome {activeUser}</h1>
        <p>
          Available resources:{" "}
          <span className="number">{currentUserData.resources}</span>
          <span>
            <img src={Gear} alt="a small machine gear" height="30px" />
          </span>
        </p>
      </div>
      <div id="dashboard">
        <div id="left-side">
          <div id="robot-list-header">
            <h2>
              Your Robots:
              <span>(You have {currentUserData.numberOfRobots} robots)</span>
            </h2>
          </div>
          <div id="robot-list">
            {robotData.map((robot) => {
              if (robot.creatorName === activeUser) {
                return (
                  <>
                    <div className="robot-data">
                      <div className="robot-image">
                        <img
                          src={require(`../images/robots/robot-${robot.imageNumber}.png`)}
                          alt={`robot-${robot.imageNumber}`}
                          width="150"
                          height="200"
                        />
                      </div>
                      <div className="robot-description">
                        <h1>{robot.robotName}</h1>
                        <div className="robot-health">
                          <span>Robot's health:</span>
                          <ProgressBar
                            bgcolor="#80D0B2"
                            completed={robot.health}
                          />
                        </div>
                        <p>
                          <span>Status: </span>
                          {robot.currentStatus}
                        </p>
                        <p className="robot-id">
                          <span>Serial Number: </span>
                          {robot._id}
                        </p>
                        <p className="date">
                          <span>Date Of Creation: </span>
                          {robot.currentDate}
                        </p>

                        <button
                          id={robot._id}
                          name={robot.robotName}
                          status={robot.currentStatus}
                          onClick={handleClickStatus}
                        >
                          Change Status
                        </button>
                      </div>
                    </div>
                  </>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <aside>
          <div id="leaderboard">
            <h3>Robots owner leaderboard:</h3>
            <div id="player-list">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Number Of Robots</th>
                  </tr>
                </thead>
                <tbody>
                  {allUserDataOrderedArray.map((user, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.numberOfRobots}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div id="options">
            What would you like to do?
            <button onClick={handleClickCreateRobot}>
              <div className="resources-in-button">
                Create A New Robot ( - 200
                <span>
                  <img src={Gear} alt="a small machine gear" height="15px" />
                </span>
                )
              </div>
            </button>
            <button onClick={handleClickDeleteRobot}>
              <div className="resources-in-button">
                Destroy A Robot ( + 150
                <span>
                  <img src={Gear} alt="a small machine gear" height="15px" />
                </span>
                )
              </div>
            </button>
            <button onClick={handleClickCombat}>Attack another player!</button>
          </div>
        </aside>
        <CreateNewRobotModal
          handleClick={handleClickCreateRobot}
          modalState={createRobotModalState}
          creatorName={activeUser}
        />
        <DeleteRobotModal
          handleClick={handleClickDeleteRobot}
          modalState={deleteRobotModalState}
          creatorName={activeUser}
          allRobots={allRobotsArray}
        />
        <CombatModal
          handleClick={handleClickCombat}
          modalState={combatModalState}
          allUsers={allUsernamesArray}
          robotsAmount={allRobotsAmountArray}
          resourcesAmount={allResourcesAmountArray}
          currentUserIndex={currentUserIndex}
        />
        <StatusModal
          handleClick={handleClickStatus}
          modalState={statusModalState}
          creatorName={activeUser}
          selectedRobotName={selectedRobotName}
          selectedRobotID={selectedRobotID}
          selectedRobotStatus={selectedRobotStatus}
        />
        <NotificationModal
          modalState={raidNotificationModalState}
          creatorName={activeUser}
          byWhom={currentUserData.byWhom}
          resourcesLost={currentUserData.resourcesLost}
        />
        <ResourcesNotificationModal
          handleClick={handleClickCreateRobot}
          modalState={resourcesNotificationModalState}
        />
        <RobotsNotificationModal
          handleClick={handleClickDeleteRobot}
          modalState={robotsNotificationModalState}
        />
        <NoRobotsNotificationModal
          handleClick={handleClickCombat}
          modalState={noRobotsNotificationModalState}
        />
        <PhoneNotificationModal/>
      </div>
    </main>
  );
}

export default Dashboard;
