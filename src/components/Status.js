import React, {useState} from "react";

import "./modal.css";

export default function StatusModal(props) {
  
  const [checkRadio, setCheckRadio] = useState("");
  const [statusToChange, setStatusToChange] = useState({_id: props.selectedRobotID}, {currentStatus: props.selectedRobotStatus});

  async function handleSubmit(event) {
    event.preventDefault();
    await fetch("api/update-status", {
      headers: {"content-type": "application/json"},
      method: "POST",
      body: JSON.stringify(statusToChange),
    }).then(
      (window.location.href = `/dashboard?username=${btoa(props.creatorName)}`)
    );
  }
  
  function handleChangesToStatus(event) {
    if (event.target.name === "Defending") {
      setCheckRadio("Defending");
      setStatusToChange({
        ...statusToChange,
        _id: props.selectedRobotID,
        currentStatus: "Defending",
      });
    } else if (event.target.name === "Gathering") {
      setCheckRadio("Gathering");
      setStatusToChange({
        ...statusToChange,
        _id: props.selectedRobotID,
        currentStatus: "Gathering",
      });
    } else if (event.target.name === "Repairing") {
      setCheckRadio("Repairing");
      setStatusToChange({
        ...statusToChange,
        _id: props.selectedRobotID,
        currentStatus: "Repairing",
      });
    }
  }

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>Change {props.selectedRobotName}'s Status</h1>
            <form id="status-form" onSubmit={handleSubmit}>
              <div id="radios">
              <input
                type="radio"
                name="Defending"
                checked={checkRadio === "Defending"}
                onChange={handleChangesToStatus}
              />
              Defending
              <input
                type="radio"
                name="Gathering"
                checked={checkRadio === "Gathering"}
                onChange={handleChangesToStatus}
              />
              Gather Resources
              <input
                type="radio"
                name="Repairing"
                checked={checkRadio === "Repairing"}
                onChange={handleChangesToStatus}
              />
              Repair
              </div>
              <div id="buttons">
              <button type="submit">
                Submit
              </button>
              <button onClick={props.handleClick}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
