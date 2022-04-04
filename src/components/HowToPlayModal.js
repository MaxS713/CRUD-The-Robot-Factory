import React from "react";
import "./modal.css";

export default function HowToPlayModal(props) {
  if (props.modalState === true) {
    return (
      <main id="overlay">
        <div id="modal-background">
          <div id="modal-content">
            <h1>How To Play</h1>
            <p>Hello! Thanks for playing my game.</p>
            <p>
              The goal is simple, own more robots than the other players and
              reach the top of the leaderboard!
            </p>
            <p>
              Your robots can be used to defend your base, or attack other
              players to try to steal their resources.
            </p>
            <p>
              Your robots can also be used to gather resources, they will go out
              and slowly collect them for you, although they can only carry so
              much, be sure to come back regularly to call them back.
            </p>
            <p>
              Also, if your robots were damaged in combat, you can send them to
              be repaired...
            </p>
            <p>
              If your robots are out gathering or being repaired, they cannot
              attack or defend your base.
            </p>
            <p>Good luck!</p>
            <button onClick={props.handleClick}>Go back</button>
          </div>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
