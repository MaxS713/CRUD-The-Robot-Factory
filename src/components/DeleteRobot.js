import React, {useState} from "react";
import DeleteConfirmBox from "./DeleteConfirmBox";
import Gear from "../images/gear.png";
import "./modal.css";

export default function DeleteRobotModal(props) {
  const [confirmBoxModalState, setConfirmBoxModalState] = useState(false);
  const [selectedRobotIndex, setSelectedRobotIndex] = useState("");

  function handleClickConfirmBox(event) {
    if (confirmBoxModalState === true) {
      setConfirmBoxModalState(false);
    } else {
      setSelectedRobotIndex(event.target.id);
      setConfirmBoxModalState(true);
    }
  }

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>Destroy A Robot</h1>
            <p>Which robot would you like to delete?</p>
            <p>
              You will get
              <span className="resources-in-p">
                &nbsp;150
                <img src={Gear} alt="a small machine gear" height="15px" />
              </span>
              recycled.
            </p>
              <table>
                <thead>
                  <tr>
                    <th>Robot Name</th>
                    <th></th>
                  </tr>
                </thead>
                {props.allRobots.map((robot, index) => {
                  return (
                    <>
                      <tr>
                        <td>{robot}</td>
                        <td
                          onClick={handleClickConfirmBox}
                          className="links"
                          id={index}
                        >
                          Select
                        </td>
                      </tr>
                    </>
                  );
                })}
              </table>
            <div id="buttons">
              <button onClick={props.handleClick}>Cancel</button>
            </div>
          </div>
        </div>
        <DeleteConfirmBox
          handleClick={handleClickConfirmBox}
          modalState={confirmBoxModalState}
          indexToDelete={selectedRobotIndex}
          allRobots={props.allRobots}
          creatorName={props.creatorName}
        />
      </main>
    );
  } else {
    return null;
  }
}
