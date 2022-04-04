import React from "react";
import "./modal.css";

export default function NotificationModal(props) {
  async function handleClick(event) {
    event.preventDefault();
    await fetch(`api/notification-off/${props.creatorName}`).then(
      (window.location.href = `/dashboard?username=${btoa(props.creatorName)}`)
    );
  }

  if (props.modalState === true && props.resourcesLost !== 0) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>You've been raided by {props.byWhom}!</h1>
            <p>You've lost {props.resourcesLost}</p>
            <p>Your defending robots lost some health during the battle...</p>
            <button onClick={handleClick}>OK</button>
          </div>
        </div>
      </main>
    );
  } else if (props.modalState === true && props.resourcesLost === 0) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>You've been raided by {props.byWhom}!</h1>
            <p>But you were able to defend yourself.</p>
            <p>
              Your defending robots lost a little health during the battle...
            </p>
            <button onClick={handleClick}>OK</button>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
