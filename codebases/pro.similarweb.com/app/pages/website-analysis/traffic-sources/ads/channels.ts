import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export const ALL_DISPLAY = -1;
export const ALL_VIDEO = -2;

export const DESKTOP_DISPLAY = 1;
export const MOBILE_DISPLAY = 2;
export const DESKTOP_VIDEO = 4;
export const MOBILE_VIDEO = 5;
export const VIDEO_OTHER = 6;
export const HTML5 = 7;

export const ChannelType = {
    "ALL DISPLAY": ALL_DISPLAY,
    "Desktop Display": DESKTOP_DISPLAY,
    "Mobile Display": MOBILE_DISPLAY,
    "Desktop Video": DESKTOP_VIDEO,
    "Mobile Video": MOBILE_VIDEO,
    ALL_VIDEO,
    HTML5,
};

export const WebSourceToChannelType = {
    [devicesTypes.TOTAL]: ALL_DISPLAY,
    [devicesTypes.MOBILE]: MOBILE_DISPLAY,
    [devicesTypes.DESKTOP]: DESKTOP_DISPLAY,
};
