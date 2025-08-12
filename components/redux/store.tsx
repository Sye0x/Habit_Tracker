import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
    reducer: rootReducer,  // <-- must be 'reducer'
});

export default store;
