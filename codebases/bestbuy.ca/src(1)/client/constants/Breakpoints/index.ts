import {Breakpoint} from "models";

export enum BreakPointNames {
    extraSmall = "extraSmall",
    small = "small",
    medium = "medium",
    large = "large",
    extraLarge = "extraLarge",
}

export const breakpoints: {[key in BreakPointNames]: Breakpoint} = {
    extraSmall: {maxWidth: 767, minWidth: 0, name: "extraSmall"},
    small: {maxWidth: 1024, minWidth: 768, name: "small"},
    medium: {maxWidth: 1280, minWidth: 1025, name: "medium"},
    large: {maxWidth: 1919, minWidth: 1281, name: "large"},
    extraLarge: {maxWidth: Infinity, minWidth: 1920, name: "extraLarge"},
};
