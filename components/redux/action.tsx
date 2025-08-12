import { toggle_theme } from "./constants";

export function toggletheme(item: boolean) {
    return {
        type: toggle_theme,
        data: item
    };
}
