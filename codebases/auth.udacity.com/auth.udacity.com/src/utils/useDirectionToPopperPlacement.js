/*
 * Converts language-agnostic "directions" (start, end, top, bottom) into "placements" Popper.js understands (left, right, bottom, top).
 * Handles RTL permutations by detecting if the `body` tag has `dir=rtl` set, since Popper.js computes position using JS, not CSS.
 *
 * https://github.com/FezVrasta/react-popper
 */

import {
    useState,
    useEffect
} from "react";

const useDirectionToPopperPlacement = direction => {
    const [convertedDirection, setConvertedDirection] = useState();
    const placement = {
        start: "left",
        end: "right"
    };
    const isRtl = getComputedStyle(document.body).direction === "rtl";

    useEffect(() => {
        if (direction === "start") {
            setConvertedDirection(isRtl ? placement.end : placement.start);
        } else if (direction === "end") {
            setConvertedDirection(isRtl ? placement.start : placement.end);
        } else {
            setConvertedDirection(direction);
        }
    });

    return convertedDirection;
};

export default useDirectionToPopperPlacement;