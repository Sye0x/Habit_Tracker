import { toggle_theme } from "./constants";

// Instead of: export const reducer = ...
const initialState = false;

const themeReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case toggle_theme:
            return action.data;
        default:
            return state;
    }
};

export default themeReducer;   // <-- export default here
