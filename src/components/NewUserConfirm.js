import React from "react";
import "./modal.css";


export default function NewUserConfirm(props) {

  async function handleSubmit(event) {
    event.preventDefault();
    await fetch("api/add-user", {
      headers: {"content-type": "application/json"},
      method: "POST",
      body: JSON.stringify(props.userData),
    }).then(
      (window.location.href = "/")
    );
  }

  if (props.modalState === true) {
    return (
      <div id="confirm-background">
        <div id="confirm-content">
          <h1>You're going to create this user:</h1>
          <p>Username: {props.userData.username}</p>
          <p>Passcode: {props.userData.passcode}</p>
          <button onClick={handleSubmit}>Confirm</button>
          <button onClick={props.handleClick}>Go Back</button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
