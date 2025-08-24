import { combineReducers } from 'redux';
import themeReducer from './reducer';
import userData from './userDataReducer';

const rootReducer = combineReducers({
    theme: themeReducer,  // 'theme' slice handled by themeReducer
    userData: userData
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
