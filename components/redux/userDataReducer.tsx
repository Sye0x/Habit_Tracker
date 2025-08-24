import { user_data } from "./constants";

// Instead of: export const reducer = ...
const initialState: Record<string, any> | null = null;

const userData = (state = initialState, action: any) => {
    switch (action.type) {
        case user_data:
            return action.data;
        default:
            return state;
    }
};


export default userData;   // <-- export default here
