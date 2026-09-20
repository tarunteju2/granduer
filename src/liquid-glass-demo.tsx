import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LiquidGlassNav from "./components/ui/liquid-glass-nav";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LiquidGlassNav />
  </StrictMode>,
);
