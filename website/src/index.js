// import React from "react";
// import ReactDOM from "react-dom/client";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import 'select2/dist/js/select2.min.js';
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "./index.scss";
// import "./index.css";
// import store from "../src/Redux/Store"
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';


// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <>
//       <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//     <App /> 


//     </PersistGate>
//   </Provider>
//   </>
// );

// reportWebVitals();


import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'select2/dist/js/select2.min.js';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";
import "./index.css";
import { store, persistor } from "../src/Redux/Store"; // Update this import
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
  </>
);

reportWebVitals();