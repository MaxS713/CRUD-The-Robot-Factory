import React, {useState, useEffect} from "react";
import CreateNewRobotModal from "./CreateRobot";
import DeleteRobotModal from "./DeleteRobot";
import CombatModal from "./Combat";
import StatusModal from "./Status";
import NotificationModal from "./NotificationModal";
import ResourcesNotificationModal from "./ResourcesNotificationModal";
import ProgressBar from "./ProgressBar";
import "./Dashboard.css";

function App() {
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

  let allRobotsArray = [];
  let allStatusArray = [];

  async function getRobots() {
    let allRobots = await fetch("http://localhost:5000/get-all-robots");
    allRobots = await allRobots.json();
    setRobotData(allRobots);
  }
  useEffect(() => {
    getRobots();
  }, []);

  async function getUsers() {
    let allUsers = await fetch("http://localhost:5000/get-all-users");
    allUsers = await allUsers.json();
    setUserDatabase(allUsers);
  }
  useEffect(() => {
    getUsers();
  }, []);

  async function getCurrentUserInfo() {
    let userData = await fetch(`http://localhost:5000/user/${activeUser}`);
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
  });

  const [createRobotModalState, setCreateRobotModalState] = useState(false);
  function handleClickCreateRobot() {
    if (currentUserData.resources < 200) {
      setResourcesNotificationModalState(true);
    } else if (createRobotModalState === true) {
      setCreateRobotModalState(false);
    } else {
      setCreateRobotModalState(true);
    }
  }

  const [deleteRobotModalState, setDeleteRobotModalState] = useState(false);
  function handleClickDeleteRobot() {
    if (deleteRobotModalState === true) {
      setDeleteRobotModalState(false);
    } else {
      setDeleteRobotModalState(true);
    }
  }

  const [combatModalState, setCombatModalState] = useState(false);
  function handleClickCombat() {
    if (combatModalState === true) {
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

  const [resourcesNotificationModalState, setResourcesNotificationModalState] =
    useState(false);

  const [raidNotificationModalState, setRaidNotificationModalState] =
    useState(false);
  useEffect(() => {
    if (currentUserData.beenAttacked === true) {
      setRaidNotificationModalState(true);
    }
  }, [currentUserData.beenAttacked]);

  return (
    <main>
      <h1>Welcome {activeUser}</h1>
      <p>Available Resources: {currentUserData.resources}</p>
      <div id="dashboard">
        <div id="left-side">
          <h2>Your Robots:</h2>
          <p>You have {currentUserData.numberOfRobots} robots</p>
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
                          RobotHealth:
                          <ProgressBar
                            bgcolor="#6a1b9a"
                            completed={robot.health}
                          />
                        </div>
                        <p>Status: {robot.currentStatus}</p>
                        <p>Serial Number: {robot._id}</p>
                        <p>Date Of Creation: {robot.currentDate}</p>
                        
        
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
          Robot's owner leaderboard:
          <div id="player-list">
            <ol>
              {" "}
              Username:
              {allUserDataOrderedArray.map((user) => {
                return <li>{user.username}</li>;
              })}
            </ol>
            <ul>
              {" "}
              Number Of Robots:
              {allUserDataOrderedArray.map((user) => {
                return <li>{user.numberOfRobots}</li>;
              })}
            </ul>
          </div>
          <div id="options">
            What would you like to do?
            <button onClick={handleClickCreateRobot}>
              Create A New Robot (200)
            </button>
            <button onClick={handleClickDeleteRobot}>
              Destroy One Of Your Robots
            </button>
            <button onClick={handleClickCombat}>Attack another Player!</button>
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
          modalState={resourcesNotificationModalState}
          creatorName={activeUser}
        />
      </div>
    </main>
  );
}

export default App;
