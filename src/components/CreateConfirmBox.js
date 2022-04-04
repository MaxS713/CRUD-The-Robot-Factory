import React from "react";
import "./modal.css";

export default function CreateConfirmBox(props) {
  async function handleCreate(event) {
    event.preventDefault();
    await fetch("https://crud-backend-navy.vercel.app/add-robot", {
      headers: {"content-type": "application/json"},
      method: "POST",
      body: JSON.stringify(props.inputToCreate),
    }).then(
      (window.location.href = `/dashboard?username=${props.inputToCreate.creatorName}`)
    );
  }
  if (props.modalState === true) {
    return (
      <div id="confirm-background">
        <div id="confirm-content">
          <h1>You're going to create this robot:</h1>
          <p>{props.inputToCreate.robotName}</p>
          <img
            src={require(`../images/robots/robot-${props.inputToCreate.imageNumber}.png`)}
            alt={`robot-${props.inputToCreate.imageNumber}`}
            width="150"
            height="200"
          />
          <div id="buttons">
            <button onClick={handleCreate}>Confirm</button>
            <button onClick={props.handleClick}>Go Back</button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
