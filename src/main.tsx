import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// DEV-only: log CSP violations to the console
if (import.meta.env.DEV && !(window as any).__cspLoggerAdded) {
  window.addEventListener(
    "securitypolicyviolation",
    (e: SecurityPolicyViolationEvent) => {
      console.group("%cCSP violation", "color:#d00;font-weight:bold;");
      console.log("directive:", e.effectiveDirective);
      console.log("blockedURI:", e.blockedURI);
      console.log(
        "sourceFile:",
        e.sourceFile,
        "line:",
        e.lineNumber,
        "col:",
        e.columnNumber
      );
      console.log("documentURI:", e.documentURI);
      console.groupEnd();
    }
  );
  (window as any).__cspLoggerAdded = true; // avoid duplicates during HMR
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
