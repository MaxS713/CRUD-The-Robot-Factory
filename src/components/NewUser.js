import React, {useState} from "react";
import NewUserConfirm from "./NewUserConfirm";
import "./Login.css";

export default function Login() {
  const [userData, setUserData] = useState({username: ""}, {passcode: ""});

  const [newUserConfirmModalState, setNewUserConfirmModalState] =
    useState(false);
  function handleClick() {
    if (newUserConfirmModalState === true) {
      setNewUserConfirmModalState(false);
    } else {
      setNewUserConfirmModalState(true);
    }
  }

  function handleChanges(event) {
    setUserData({...userData, [event.target.name]: event.target.value});
  }

  return (
    <main>
      <div className="app">
        <div className="login-form">
          <div className="title">Create A New User</div>
          <form>
            <div className="input-container">
              <label>Username :</label>
              <input
                type="text"
                name="username"
                autoComplete="off"
                onChange={handleChanges}
                required
              />
            </div>
            <div className="input-container">
              <label>Passcode :</label>
              <input
                className="key"
                type="text"
                autoComplete="off"
                name="passcode"
                onChange={handleChanges}
                required
              />
            </div>
            <div className="button-container">
            <button
              onClick={(event) => {
                event.preventDefault();
                handleClick();
              }}
            >
              Register
            </button>
            </div>
          </form>
        </div>
      </div>
      <NewUserConfirm
        modalState={newUserConfirmModalState}
        userData={userData}
        handleClick={handleClick}
      />
    </main>
  );
}
