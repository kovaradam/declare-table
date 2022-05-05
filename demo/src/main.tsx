import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";

const containerElement = document.getElementById("root");

if (!containerElement) {
  throw "root element not found";
}

const root = createRoot(containerElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
