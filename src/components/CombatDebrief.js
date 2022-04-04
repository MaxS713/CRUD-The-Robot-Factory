import React, {useState, useEffect} from "react";
import "./modal.css";

export default function CombatDebrief(props) {
  const [raidData, setRaidData] = useState([]);
  let fetchDataLoop = 0;

  async function getRaidReport() {
    if (props.modalState === true && fetchDataLoop === 0) {
      let raidData = await fetch(
        `api/combat/${props.attackingPlayer}/${props.attackedPlayer}`
      );
      raidData = await raidData.json();
      setRaidData(raidData);
    }
  }

  useEffect(() => {
    getRaidReport();
    fetchDataLoop++;
  }, [props.modalState]);


    if (props.modalState === true && raidData.win === props.attackingPlayer) {
      return (
        <>
          <div id="confirm-background">
            <div id="confirm-content">
              <h1>You raided: {props.attackedPlayer} and won!</h1>
              <p>
                {props.attackedPlayer} had {raidData.robotsDefending} robot(s) defending when you
                arrived.
              </p>
              <p>You were able to steal {raidData.resources} resources!</p>
              <p>Your robots lost a little health during the assault...</p>
              <button
                onClick={() => {
                  window.location.href = `/dashboard?username=${props.attackingPlayer}`;
                }}
              >
                OK
              </button>
            </div>
          </div>
        </>
      );
    } else if (props.modalState === true && raidData.win === props.attackedPlayer) {
      return (
        <>
          <div id="confirm-background">
            <div id="confirm-content">
              <h1>
                You raided: {props.attackedPlayer} and were pushed back...
              </h1>
              <p>
                {props.attackedPlayer} had {raidData.robotsDefending} robot(s) defending when you
                arrived.
              </p>
              <p>You weren't able to steal any resources...</p>
              <p>Your robots lost some health during the assault...</p>
              <button
                onClick={() => {
                  window.location.href = `/dashboard?username=${props.attackingPlayer}`;
                }}
              >
                OK
              </button>
            </div>
          </div>
        </>
      );
  } else {
    return null;
  }
}
