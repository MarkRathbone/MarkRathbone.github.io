import React from "react";
import { createRoot } from "react-dom/client";
import { load as loadYaml } from "js-yaml";
import cvSource from "../cv.yaml?raw";
import App from "./App.jsx";
import "./styles.css";

const cv = loadYaml(cvSource);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App cv={cv} />
  </React.StrictMode>,
);
