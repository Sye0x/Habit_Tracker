import { user_data } from "./constants";

export function userdata(items: any) {
    return {
        type: user_data,
        data: items
    };
}
