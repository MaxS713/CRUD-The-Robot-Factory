import React, {useState} from "react";
import "./Login.css";

export default function Login() {

const [userData, setUserData] = useState({username: ""}, {passcode: ""},);

async function handleSubmit(){
  await fetch("http://localhost:5000/add-user", {
    headers: {"content-type": "application/json"},
    method: "POST",
    body: JSON.stringify(userData),
  });
}

function handleChanges(event) {
  setUserData({...userData, [event.target.name]: event.target.value});
}

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username :</label>
          <input type="text" name="username" onChange={handleChanges} required />
        </div>
        <div className="input-container">
          <label>Passcode :</label>
          <input className="key" type="text" autocomplete="off" name="passcode" onChange={handleChanges} required />
        </div>
        <button type="submit" value="Submit">
            Register
        </button>
      </form>
    </div>
  );
}
