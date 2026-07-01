import React from "react";
import ReactDOM from "react-dom/client";
import { StackProvider, StackTheme } from "@stackframe/react";
import App from "./App.tsx";
import { CloudAuthProvider } from "./auth/CloudAuthProvider";
import { I18nProvider } from "./i18n/I18nProvider";
import { stackClientApp } from "./lib/stack";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

// Cloud mode wraps the app in Neon Auth providers. When it isn't configured the
// app renders on its own and uses the offline AuthContext default.
const tree = stackClientApp ? (
  <StackProvider app={stackClientApp}>
    <StackTheme>
      <CloudAuthProvider>
        <App />
      </CloudAuthProvider>
    </StackTheme>
  </StackProvider>
) : (
  <App />
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nProvider>{tree}</I18nProvider>
  </React.StrictMode>,
);
