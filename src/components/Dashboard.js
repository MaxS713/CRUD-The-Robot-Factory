import React, {useState, useEffect} from "react";
import CreateNewRobotModal from "./CreateRobot";
import DeleteRobotModal from "./DeleteRobot";
import CombatModal from "./Combat";
import StatusModal from "./Status";
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

  let allUsernamesArray = [];
  let allRobotsAmountArray = [];
  let allResourcesAmountArray = [];

  let allRobotsArray = [];
  let allStatusArray = [];

  const [createRobotModalState, setCreateRobotModalState] = useState(false);
  function handleClickCreateRobot() {
    if (createRobotModalState === true) {
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
      setSelectedRobotID(event.target.id)
      setSelectedRobotName(event.target.name)
      setSelectedRobotStatus(event.target.status)
      setStatusModalState(true);
    }
  }

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

  userDatabase.forEach((username) => {
    allUsernamesArray.push(username.username);
    allRobotsAmountArray.push(username.numberOfRobots);
    allResourcesAmountArray.push(username.resources);
  });

  let currentUserIndex = allUsernamesArray.indexOf(activeUser);

  robotData.forEach((robot) => {
    if (robot.creatorName === activeUser) {
      allRobotsArray.push(robot.robotName);
      allStatusArray.push(robot.currentStatus);
    }
  })

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
                        <p>Serial Number: {robot._id}</p>
                        <p>Date Of Creation: {robot.date}</p>
                        <p>Status: {robot.currentStatus}</p>
                        <div className="robot-health">
                          RobotHealth:
                          <ProgressBar bgcolor="#6a1b9a" completed={100} />
                        </div>
                        <button id={robot._id} name={robot.robotName} status={robot.currentStatus} onClick={handleClickStatus}>
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
          What would you like to do?
          <button onClick={handleClickCreateRobot}>
            Create A New Robot (200)
          </button>
          <button onClick={handleClickDeleteRobot}>
            Destroy One Of Your Robots
          </button>
          <button onClick={handleClickCombat}>Attack another Player!</button>
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
      </div>
    </main>
  );
}

export default App;
