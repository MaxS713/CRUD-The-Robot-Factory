import React from "react";
import "./modal.css";

export default function CombatConfirmBox(props) {
  if (props.modalState === true) {
    let selectedPlayerIndex = props.selectedUserIndex;
    return (
      <div id="confirm-background">
        <div id="confirm-content">
          <h1>You're going to raid this player:</h1>
          <span>{props.usersList[selectedPlayerIndex]}</span>
          <span>{props.robotsAmountList[selectedPlayerIndex]}</span>
          <span>{props.resourcesAmountList[selectedPlayerIndex]}</span>
          <button>Confirm</button>
          <button onClick={props.handleClick}>Close</button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
