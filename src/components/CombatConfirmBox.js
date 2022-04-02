import React from "react";
import "./modal.css";

export default function CombatConfirmBox(props) {

  async function handleSubmit(event) {
    event.preventDefault();
    await fetch(`http://localhost:5000/combat/${props.usersList[props.currentUserIndex]}/${props.usersList[props.selectedUserIndex]}`).then(
      (window.location.href = `/dashboard?username=${props.usersList[props.currentUserIndex]}`)
    );
  }

  if (props.modalState === true) {
    return (
      <div id="confirm-background">
        <div id="confirm-content">
          <h1>You're going to raid this player:</h1>
          <span>{props.usersList[props.selectedUserIndex]}</span>
          <span>{props.robotsAmountList[props.selectedUserIndex]}</span>
          <span>{props.resourcesAmountList[props.selectedUserIndex]}</span>
          <p>You have: {props.robotsAmountList[props.currentUserIndex]}</p>
          <button onClick={handleSubmit}>Confirm</button>
          <button onClick={props.handleClick}>Close</button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
