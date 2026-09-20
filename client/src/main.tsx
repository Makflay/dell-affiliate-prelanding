import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initializeGtm } from "./gtm";

initializeGtm();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element was not found");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
