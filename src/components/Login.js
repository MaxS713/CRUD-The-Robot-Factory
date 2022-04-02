import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate(); 

  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userDatabase, setUserDatabase] = useState([])
  const [currentUser, setCurrentUser] = useState("")

  async function getUsers() {
    let allUsers = await fetch("http://localhost:5000/get-all-users");
    allUsers = await allUsers.json();
    setUserDatabase(allUsers);
  }
  useEffect(() => {
    getUsers();
  }, []);

  const errors = {
    uname: "Unknown username",
    pass: "Invalid passcode"
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var { uname, pass } = document.forms[0];

    const userData = userDatabase.find((user) => user.username === uname.value);

    if (userData) {
      if (userData.passcode !== pass.value) {
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setCurrentUser(uname.value)
        setIsSubmitted(true);
      }
    } else {
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" autocomplete="off" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Passcode :</label>
          <input className="key" type="text" autocomplete="off" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <button type="submit">Log In</button>
          <a href="/create-new-user">Create New User</a>
        </div>
      </form>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? navigate(`/dashboard?username=${currentUser}`) : renderForm}
      </div>
    </div>
  );
}
