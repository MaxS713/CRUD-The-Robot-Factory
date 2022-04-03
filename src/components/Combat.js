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
            <h1>RAID</h1>
            Which other player would you like to attack?
            <div id="combat-list">
              <div className="table">
                <p className="thead">Username:</p>
                {props.allUsers.map((user, index) => {
                  if (index !== props.currentUserIndex) {
                    return <p>{user}</p>;
                  } else {
                    return null;
                  }
                })}
              </div>
              <div className="table">
              <p className="thead">Robots:</p>
                {props.robotsAmount.map((amount, index) => {
                  if (index !== props.currentUserIndex) {
                    return <p>{amount}</p>;
                  } else {
                    return null;
                  }
                })}
              </div>
              <div className="table">
              <p className="thead">Resources:</p>
                {props.resourcesAmount.map((amount, index) => {
                  if (index !== props.currentUserIndex) {
                    return <p>{amount}</p>;
                  } else {
                    return null;
                  }
                })}
              </div>
              <div className="table">
              <p>&nbsp;</p>
                {props.allUsers.map((user, index) => {
                  if (index !== props.currentUserIndex) {
                    return (
                      <p
                        onClick={handleClickConfirmBox}
                        className="links"
                        id={index}
                      >
                        Select
                      </p>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
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
