import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
//step one for saga
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import axios from 'axios';
//takeEvery is a function that will watch for actions,
//put is a function that will dispatch an action
import { takeEvery, put } from 'redux-saga/effects';

const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

function* fetchElements() {
    // this will be the saga that fetches our elements from the server
    try {
        //wait for the axios call to finish
        const elements = yield axios.get(`/api/element`);
        //dispatch (put) an action to our reducer
        yield put({ type: 'SET_ELEMENTS', payload: elements.data });
    } catch (error) {
        console.log(`error in fetchElements: ${error}`)
        alert(`Something went wrong`)
    }
}

function* postElement(action) {
    try {
        yield axios.post(`/api/element`, action.payload);
        //sagas can trigger other sagas
        yield put({ type: 'FETCH_ELEMENTS' });
        //we can pass functions through actions
        action.setNewElement('');
    } catch (error) {
        console.log(`error in postElement: ${error}`)
        alert(`Something went wrong`)
    }
}

// this is the saga that will watch for actions
function* rootSaga() {
    //! FETCH_ELEMENTS is the action type
    //! fetchElements is the saga that will run
    //! do not use same action as the reducer
    yield takeEvery('FETCH_ELEMENTS', fetchElements);
    yield takeEvery('ADD_ELEMENT', postElement);
    //more sagas here
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
