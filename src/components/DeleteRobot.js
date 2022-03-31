import React, {useState} from "react";
import DeleteConfirmBox from "./DeleteConfirmBox";

import "./modal.css";

export default function DeleteRobotModal(props) {

  const [confirmBoxModalState, setConfirmBoxModalState] = useState(false);

  function handleClickConfirmBox(event) {
    if (confirmBoxModalState === true) {
      setConfirmBoxModalState(false);
    } else {
      setConfirmBoxModalState(true);
    }
  }


  const [inputToDelete, setInputToDelete] = useState(
    {creatorName: props.creatorName},
    {robotName: ""},
  );

  function handleChangesToDelete(event) {
    setInputToDelete({
      ...inputToDelete,
      [event.target.name]: event.target.value,
    });
  }


  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>DELETE</h1>
            <form>
              <p>Enter the name of the robot you would like to delete:</p>
              <p>You will get 200 recycled</p>
              <label>
                Name:
                <input
                  type="text"
                  name="robotName"
                  onChange={handleChangesToDelete}
                />
              </label>
              <div>
              <button onClick={(event) => {event.preventDefault(); handleClickConfirmBox()}}>Submit</button>
              <button onClick={props.handleClick}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
        <DeleteConfirmBox
          handleClick={handleClickConfirmBox}
          modalState={confirmBoxModalState}
          inputToDelete={inputToDelete}
        />
      </main>
    );
  } else {
    return null;
  }
}
