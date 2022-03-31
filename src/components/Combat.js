import React from "react";

import "./modal.css";

export default function CombatModal(props) {

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>FIGHT</h1>
              <button onClick={props.handleClick}>Cancel</button>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
