import { combineReducers } from 'redux';
import themeReducer from './reducer';

const rootReducer = combineReducers({
    theme: themeReducer,  // 'theme' slice handled by themeReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
