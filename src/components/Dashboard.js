import React, {useState, useEffect} from "react";
import CreateNewRobotModal from "./CreateRobot";
import ProgressBar from "./ProgressBar";
import "./Dashboard.css";

function App() {

  let params = new URLSearchParams(document.location.search);
  let activeUser = params.get("username");

  const [robotData, setRobotData] = useState([]);

  const [createRobotModalState, setCreateRobotModalState] = useState(false);
  function handleClickCreateRobot (){
    if (createRobotModalState === true){
      setCreateRobotModalState(false);
    } else {
      setCreateRobotModalState(true);
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
      <div id="robot-list">
              <h1>Your Robots:</h1>
      <div id="robot-data">
        {robotData.map((robot) => {
          if (robot.creatorName === activeUser) {
            return (
              <>
                <div className="robot-image">
                <img src={require(`../images/robots/robot-${robot.imageNumber}.png`)} alt={`robot-${robot.imageNumber}`} width="150" height="200" />
                </div>
                <div className="robot-description">
                <h1>--- {robot.robotName} ---</h1>
                <h2>Creator: {robot.creatorName}</h2>
                <p>Serial Number: {robot._id}</p>
                <p>Date Of Creation: {robot.date}</p>
                <div className="robot-health">
                RobotHealth:
                <ProgressBar bgcolor="#6a1b9a" completed={100} />
                </div>
                <h1>---------------------</h1>
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
      <button onClick={handleClickCreateRobot}>Create A New Robot (200)</button>
      <button>Something</button>
      <button>Something</button>
      <button>Something</button>
      </aside>
      <CreateNewRobotModal handleClick={handleClickCreateRobot} modalState={createRobotModalState} creatorName={activeUser} />
    </main>
  );
}

export default App;
