import React from "react";
import { render } from "react-dom";
import App from "./App.tsx";
import "./styles/main.scss";
import { Provider } from "react-redux";
import { store } from "./services/redux/store.ts";

const root = document.getElementById("root");

render(
  <React.StrictMode>
   <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  root
);
