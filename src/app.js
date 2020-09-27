import React from "react";
import "./app.css";
import { Popup, Tooltip } from "./Components/multiuseElements";

const App = () => {
  return (
    <div className="App">
      <div className="box"></div>
      <div className="boxing">
        <Popup content={"Hi, this is created using react createPortal"}>
          <span>try</span>
        </Popup>
      </div>
    </div>
  );
};

export default App;
