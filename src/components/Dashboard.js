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

  const [robotData, setRobotData] = useState([]);

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
  function handleClickStatus() {
    if (statusModalState === true) {
      setStatusModalState(false);
    } else {
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

  return (
    <main id="dashboard">
      <div id="left-side">
        <h1>Your Robots:</h1>
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
                      <div className="robot-health">
                        RobotHealth:
                        <ProgressBar bgcolor="#6a1b9a" completed={100} />
                      </div>
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
        <button onClick={handleClickStatus}>Manage Your Robots</button>
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
        creatorName={activeUser}
      />
      <StatusModal
        handleClick={handleClickStatus}
        modalState={statusModalState}
        creatorName={activeUser}
      />
    </main>
  );
}

export default App;
