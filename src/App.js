import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import NewUser from "./components/NewUser";
import miniRobot from "./images/mini-robot.png";
import "./App.css";

function App() {
  return (
    <div className="wrapper">
      <div id="image-and-title">
        <img src={miniRobot} alt="a cute little robot" width="100px" />
        <h1>CRUD - The Robot Factory</h1>
      </div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/create-new-user" element={<NewUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
