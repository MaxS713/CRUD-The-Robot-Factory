import React, {useState} from "react";
import CombatConfirmBox from "./CombatConfirmBox";
import "./modal.css";

export default function CombatModal(props) {
  const [confirmBoxModalState, setConfirmBoxModalState] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState("");

  function handleClickConfirmBox(event) {
    if (confirmBoxModalState === true) {
      setConfirmBoxModalState(false);
    } else {
      setSelectedUserIndex(event.target.id);
      setConfirmBoxModalState(true);
    }
  }

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>FIGHT</h1>
            Which player would you like to attack?
            <div id="players-list">
              <ul>
                {props.allUsers.map((user, index) => {
                  if (index !== props.currentUserIndex) {
                    return <li>{user}</li>;
                  } else {
                    return null;
                  }
                })}
              </ul>
              <ul>
                {props.robotsAmount.map((amount, index) => {
                  if (index !== props.currentUserIndex) {
                    return <li>{amount}</li>;
                  } else {
                    return null;
                  }
                })}
              </ul>
              <ul>
                {props.resourcesAmount.map((amount, index) => {
                  if (index !== props.currentUserIndex) {
                    return <li>{amount}</li>;
                  } else {
                    return null;
                  }
                })}
              </ul>
              <ul>
                {props.allUsers.map((user, index) => {
                  if (index !== props.currentUserIndex) {
                    return (
                      <li
                        onClick={handleClickConfirmBox}
                        className="links"
                        id={index}
                      >
                        Attack
                      </li>
                    );
                  } else {
                    return null;
                  }
                })}
              </ul>
            </div>
            <button onClick={props.handleClick}>Cancel</button>
          </div>
        </div>
        <CombatConfirmBox
          handleClick={handleClickConfirmBox}
          modalState={confirmBoxModalState}
          selectedUserIndex={selectedUserIndex}
          currentUserIndex={props.currentUserIndex}
          usersList={props.allUsers}
          robotsAmountList={props.robotsAmount}
          resourcesAmountList={props.resourcesAmount}
        />
      </main>
    );
  } else {
    return null;
  }
}
