import React from "react";
import {
    ALL_DISPLAY,
    DESKTOP_DISPLAY,
    MOBILE_DISPLAY,
    ALL_VIDEO,
    DESKTOP_VIDEO,
    MOBILE_VIDEO,
} from "../channels";
const CreativeCounter = ({ count, channel }) => {
    if (count) {
        let text;
        switch (channel) {
            case ALL_DISPLAY:
            case DESKTOP_DISPLAY:
            case MOBILE_DISPLAY:
                text = "Creatives";
                break;
            case ALL_VIDEO:
            case DESKTOP_VIDEO:
            case MOBILE_VIDEO:
                text = "Videos";
        }
        return (
            <div className="gallery-counter">
                <span className="count">{count}</span>
                <span>{text}</span>
            </div>
        );
    } else return null;
};

export default CreativeCounter;
