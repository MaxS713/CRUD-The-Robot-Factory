import React from "react";
import "./modal.css";

export default function PhoneNotificationModal(props) {
  return (
    <main id="phone-notif">
      <div id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <p>
              Zoom out or rotate phone to landscape mode for better experience.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
