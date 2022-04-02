import React from "react";
import "./modal.css";

export default function ResourcesNotificationModal(props) {
  
  async function handleClick(event) {
    event.preventDefault();
    window.location.href = `/dashboard?username=${props.creatorName}`;
  }

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <p>You don't have enough resources...</p>
            <button onClick={handleClick}>OK</button>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
