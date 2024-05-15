import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "../css/index.css";

const root = document.getElementById("root");
const path = root?.dataset.path || "";

ReactDOM.createRoot(root!).render(
    <React.StrictMode>
        <App path={path} />
    </React.StrictMode>,
);
