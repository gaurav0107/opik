import React from "react";
import ReactDOM from "react-dom/client";

import "../main.scss";
import MyPreferencesPocPage from "./MyPreferencesPocPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="mx-auto max-w-[1168px]">
      <MyPreferencesPocPage />
    </div>
  </React.StrictMode>,
);
