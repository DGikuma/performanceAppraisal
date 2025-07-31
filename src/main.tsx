import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/auth-context"; // 👈 import AuthProvider

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <AuthProvider> {/* ✅ Wrap App with AuthProvider */}
        <main className="text-foreground bg-background">
          <App />
        </main>
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>
);
