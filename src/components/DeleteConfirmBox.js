import React from "react";
import "./modal.css";

export default function DeleteConfirmBox(props) {
  async function handleDelete(event) {
    event.preventDefault();
    await fetch("api/delete-robot", {
      headers: {"content-type": "application/json"},
      method: "POST",
      body: JSON.stringify({
        creatorName: props.creatorName,
        robotName: props.allRobots[props.indexToDelete],
      }),
    }).then(
      (window.location.href = `/dashboard?username=${btoa(props.creatorName)}`)
    );
  }

  if (props.modalState === true) {
    return (
      <div id="confirm-background">
        <div id="confirm-content">
          <h1>
            Are you sure you want to delete{" "}
            {props.allRobots[props.indexToDelete]}?
          </h1>
          <div id="buttons">
            <button onClick={handleDelete}>Confirm</button>
            <button onClick={props.handleClick}>Go Back</button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
