import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/i18n";
import { App } from "./app/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
