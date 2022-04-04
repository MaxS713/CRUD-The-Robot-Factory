import React, {useState} from "react";
import Carousel from "react-simply-carousel";
import CreateConfirmBox from "./CreateConfirmBox";

import Gear from "../images/gear.png";

import Robot1 from "../images/robots/robot-1.png";
import Robot2 from "../images/robots/robot-2.png";
import Robot3 from "../images/robots/robot-3.png";
import Robot4 from "../images/robots/robot-4.png";
import Robot5 from "../images/robots/robot-5.png";
import Robot6 from "../images/robots/robot-6.png";
import Robot7 from "../images/robots/robot-7.png";
import Robot8 from "../images/robots/robot-8.png";
import Robot9 from "../images/robots/robot-9.png";
import Robot10 from "../images/robots/robot-10.png";

import "./modal.css";

export default function CreateNewRobotModal(props) {
  const [confirmBoxModalState, setConfirmBoxModalState] = useState(false);
  function handleClickConfirmBox(event) {
    if (confirmBoxModalState === true) {
      setConfirmBoxModalState(false);
    } else {
      setConfirmBoxModalState(true);
    }
  }

  const [activeSlide, setActiveSlide] = useState(0);

  const [inputToCreate, setInputToCreate] = useState(
    {creatorName: props.creatorName},
    {robotName: ""},
    {imageNumber: ""}
  );

  function handleChangesToCreate(event) {
    setInputToCreate({
      ...inputToCreate,
      [event.target.name]: event.target.value,
      imageNumber: (activeSlide + 1).toString(),
    });
  }

  function setImageNumber() {
    setInputToCreate({
      ...inputToCreate,
      imageNumber: (activeSlide + 1).toString(),
    });
  }

  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>Create A Robot</h1>
            <form>
              <p>Here you can add a robot to your roster.</p>
              <p>
                To build it, it will cost:
                <span className="resources-in-p">
                  &nbsp;200
                  <img src={Gear} alt="a small machine gear" height="15px" />
                </span>
              </p>
              <label>
                Robot name:&nbsp;
                <input
                  type="text"
                  name="robotName"
                  onChange={handleChangesToCreate}
                  autocomplete="off"
                />
              </label>
              <div id="carousel">
                <Carousel
                  updateOnItemClick
                  containerProps={{
                    style: {
                      justifyContent: "space-between",
                    },
                  }}
                  activeSlideIndex={activeSlide}
                  onRequestChange={setActiveSlide}
                  forwardBtnProps={{
                    children: ">",
                    style: {
                      width: 60,
                      height: 60,
                      minWidth: 60,
                      alignSelf: "center",
                    },
                  }}
                  backwardBtnProps={{
                    children: "<",
                    style: {
                      width: 60,
                      height: 60,
                      minWidth: 60,
                      alignSelf: "center",
                    },
                  }}
                  itemsToShow={1}
                  speed={400}
                >
                  <div>
                    <img src={Robot1} alt="robot-1" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot2} alt="robot-2" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot3} alt="robot-3" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot4} alt="robot-4" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot5} alt="robot-5" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot6} alt="robot-6" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot7} alt="robot-7" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot8} alt="robot-8" height="280" width="180" />
                  </div>
                  <div>
                    <img src={Robot9} alt="robot-9" height="280" width="180" />
                  </div>
                  <div>
                    <img
                      src={Robot10}
                      alt="robot-10"
                      height="280"
                      width="180"
                    />
                  </div>
                </Carousel>
              </div>
              <div id="buttons">
              <button
                disabled={!inputToCreate.robotName || confirmBoxModalState}
                onClick={(event) => {
                  event.preventDefault();
                  setImageNumber();
                  handleClickConfirmBox();
                }}
              >
                Create
              </button>
              <button disabled={confirmBoxModalState} onClick={props.handleClick}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
        <CreateConfirmBox
          handleClick={handleClickConfirmBox}
          modalState={confirmBoxModalState}
          inputToCreate={inputToCreate}
        />
      </main>
    );
  } else {
    return null;
  }
}
