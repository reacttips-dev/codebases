// export const FIRST_SEEN = "FirstDetected";
// export const LAST_SEEN = "LastDetected";
// export const ACTIVE_DAYS = "ActiveDays";
export const FIRST_SEEN = "first_seen";
export const LAST_SEEN = "last_seen";
export const ACTIVE_DAYS = "active_days";
export const ASCENDING = "asc";
export const DESCENDING = "desc";
export const ALL_CAMPAIGNS = null; // the underlying value of ALL_CAMPAIGNS is null since we dont

import {
    DESKTOP_DISPLAY,
    MOBILE_DISPLAY,
    DESKTOP_VIDEO,
    MOBILE_VIDEO,
    ALL_DISPLAY,
    ALL_VIDEO,
} from "./channels";
// want to include it in backend filters

const displaySortFields = [
    {
        id: "0",
        text: "First seen",
        value: FIRST_SEEN,
    },
    {
        id: "1",
        text: "Last seen",
        value: LAST_SEEN,
    },
    {
        id: "2",
        text: "Active days",
        value: ACTIVE_DAYS,
    },
];
const videoSortFields = [
    {
        id: "0",
        text: "First seen",
        value: FIRST_SEEN,
    },
    {
        id: "1",
        text: "Last seen",
        value: LAST_SEEN,
    },
    {
        id: "2",
        text: "Active days",
        value: ACTIVE_DAYS,
    },
];

export const sortFields = {
    [ALL_DISPLAY]: displaySortFields,
    [DESKTOP_DISPLAY]: displaySortFields,
    [MOBILE_DISPLAY]: displaySortFields,
    [ALL_VIDEO]: videoSortFields,
    [DESKTOP_VIDEO]: videoSortFields,
    [MOBILE_VIDEO]: videoSortFields,
};

export const sortDirections = [ASCENDING, DESCENDING];

export const availableChannels = {
    display: [ALL_DISPLAY, DESKTOP_DISPLAY, MOBILE_DISPLAY],
    displayLocked: [ALL_DISPLAY, MOBILE_DISPLAY],
    video: [ALL_VIDEO, DESKTOP_VIDEO, MOBILE_VIDEO],
};
