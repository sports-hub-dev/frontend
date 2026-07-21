import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";
import App from "./App";
import { store } from "./app/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "10px",
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(16,25,44,0.12)",
            },
            success: { iconTheme: { primary: "#2E8B4F", secondary: "#fff" } },
            error: { iconTheme: { primary: "#C4432E", secondary: "#fff" } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
