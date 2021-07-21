import React from "react";
import { render } from "react-dom";

function Main() {
  return(
    <React.StrictMode>
      <p>Hello</p>
  </React.StrictMode>
  )
}

render(
  <Main/>,
  document.getElementById("root")
);
