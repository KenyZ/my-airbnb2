import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Router manager
import {BrowserRouter} from 'react-router-dom'

// Date manager
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


ReactDOM.render((
    <MuiPickersUtilsProvider utils={MomentUtils}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </MuiPickersUtilsProvider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
