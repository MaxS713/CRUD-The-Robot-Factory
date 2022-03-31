import React, {useState} from "react";

import "./modal.css";

export default function DeleteRobotModal(props) {
  const [inputToDelete, setInputToDelete] = useState(
    {creatorName: props.creatorName},
    {robotName: ""},
    {imageNumber: ""}
  );

  function handleChangesToDelete(event) {
    setInputToDelete({
      ...inputToDelete,
      [event.target.name]: event.target.value,
    });
  }

  async function handleDelete(event) {
    event.preventDefault();
    await fetch("http://localhost:5000/delete-robot", {
      headers: {"content-type": "application/json"},
      method: "POST",
      body: JSON.stringify(inputToDelete),
    }).then(
      (window.location.href = `/dashboard?username=${props.creatorName}`)
    );
  }

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>DELETE</h1>
            <form onSubmit={handleDelete}>
              <p>Add a new robot:</p>
              <label>
                Name:
                <input
                  type="text"
                  name="robotName"
                  onChange={handleChangesToDelete}
                />
              </label>
              <div></div>
              <button type="submit">Submit</button>
              <button onClick={props.handleClick}>Cancel</button>
            </form>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
