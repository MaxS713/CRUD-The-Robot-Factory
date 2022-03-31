import React from "react";

import "./modal.css";

export default function StatusModal(props) {

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>Status</h1>
              <button onClick={props.handleClick}>Close</button>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
