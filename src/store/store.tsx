// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/index.tsx';

const store = configureStore({
    reducer: rootReducer,
});

export default store;
