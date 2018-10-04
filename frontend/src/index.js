import React from 'react';
import ReactDOM from 'react-dom';
import ReduxPromise from 'redux-promise';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom';

import AppRouter from './AppRouter';
import reducers from './reducers';

import './css/index.css';

//
const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

//
ReactDOM.render(
    <BrowserRouter>
        <Provider store={createStoreWithMiddleware(reducers)}>
            <Route path='/' component={AppRouter}/>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root')
);
