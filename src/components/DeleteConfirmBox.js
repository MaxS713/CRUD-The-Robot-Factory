import React from "react";
import "./modal.css";

export default function DeleteConfirmBox(props) {

  async function handleDelete(event) {
    event.preventDefault();
    await fetch("http://localhost:5000/delete-robot", {
      headers: {"content-type": "application/json"},
      method: "POST",
      body: JSON.stringify(props.inputToDelete),
    }).then(
      (window.location.href = `/dashboard?username=${props.inputToDelete.creatorName}`)
    );
  }

  if (props.modalState === true) {
    return (
      <div id="confirm-background">
        <div id="confirm-content">
          <h1>Are you sure you want to delete {props.inputToDelete.robotName}:</h1>
          <button onClick={handleDelete}>Confirm</button>
          <button onClick={props.handleClick}>Go Back</button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
