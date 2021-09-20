/*
 * Registers onKeyDown event behavior for the ESC key for dismissable components like Modal and Popover.
 * Accepts a callback which is called when the ESC key is pressed.
 */

import {
    useEffect
} from "react";

const useOnEscKeyDown = callback => {
    const handleEscKeyPress = ({
        keyCode
    }) => keyCode === 27 && callback();

    useEffect(() => {
        document.addEventListener("keydown", handleEscKeyPress);
        return () => document.removeEventListener("keydown", handleEscKeyPress);
    }, []);
};

export default useOnEscKeyDown;