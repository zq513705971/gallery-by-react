import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
import { Provider } from "mobx-react";
import store from "./store";

// Render the main component into the dom
ReactDOM.render(
    <Provider  {...store}>
        <App />
    </Provider>
    , document.getElementById('app'));
