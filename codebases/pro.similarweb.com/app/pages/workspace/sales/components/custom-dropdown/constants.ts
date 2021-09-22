import { colorsPalettes } from "@similarweb/styles";

export const VERTICAL_SCROLLBAR_STYLE = {
    backgroundColor: colorsPalettes.carbon["100"],
    borderRadius: 5,
    width: 7,
};

export const VERTICAL_SCROLLBAR_CONTAINER_STYLE = {
    background: "transparent",
    right: 1,
};

export const SCROLL_AREA_STYLE = {
    maxHeight: 320,
};

export const DROPDOWN_ALL_GROUP = "all";
export const DROPDOWN_MORE_GROUP = "more";
export const DROPDOWN_FREQUENTLY_USED_GROUP = "frequently_used";
export const DROPDOWN_GROUP_CORRECTLY_ORDERED_KEYS = [
    DROPDOWN_FREQUENTLY_USED_GROUP,
    DROPDOWN_ALL_GROUP,
    DROPDOWN_MORE_GROUP,
];
