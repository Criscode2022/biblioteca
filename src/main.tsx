import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CloudAuthProvider } from "./auth/CloudAuthProvider";
import { neonClient } from "./lib/neon";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

// Cloud mode wraps the app in Neon Auth providers. When it isn't configured the
// app renders on its own and uses the offline AuthContext default.
const tree = neonClient ? (
  <CloudAuthProvider>
    <App />
  </CloudAuthProvider>
) : (
  <App />
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>{tree}</React.StrictMode>,
);
