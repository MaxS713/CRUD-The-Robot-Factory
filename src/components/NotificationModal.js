import React from "react";
import "./modal.css";

export default function NotificationModal(props) {
  
  async function handleClick(event) {
    event.preventDefault();
    await fetch(
      `http://localhost:5000/notification-off/${props.creatorName}`
    ).then((window.location.href = `/dashboard?username=${props.creatorName}`));
  }

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>You've been raided by {props.byWhom}</h1>
            <p>You've lost {props.resourcesLost}</p>
            <button onClick={handleClick}>OK</button>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
