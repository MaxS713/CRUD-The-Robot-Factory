import React, {useState} from "react";
import CombatDebrief from "./CombatDebrief"
import "./modal.css";

export default function CombatConfirmBox(props) {

  const [debriefBoxModalState, setDebriefBoxModalState] = useState(false);

  if (props.modalState === true) {
    return (
      <>
        <div id="confirm-background">
          <div id="confirm-content">
            <h1>You're going to raid this player: {props.usersList[props.selectedUserIndex]}</h1>
            <p>The player has {props.robotsAmountList[props.selectedUserIndex]} robots and 1 defensive turret.</p>
            <p>The player owns {props.resourcesAmountList[props.selectedUserIndex]} resources.</p>
            <p>You have {props.robotsAmountList[props.currentUserIndex]} robot ready to attack.</p>
            <button onClick={()=>setDebriefBoxModalState(true)}>Confirm</button>
            <button onClick={props.handleClick}>Go Back</button>
          </div>
        </div>
        <CombatDebrief
          modalState={debriefBoxModalState}
          attackedPlayer={props.usersList[props.selectedUserIndex]}
          attackingPlayer={props.usersList[props.currentUserIndex]}
        />
      </>
    );
  } else {
    return null;
  }
}
