/*
 * Provides onClickOutside event behavior for dismissable components like Modal and Popover.
 * Accepts a ref and an event handler, and calls the handler when elements outside the ref element are clicked.
 */

import {
    useEffect,
    useRef
} from "react";

const useOnClickOutside = (ref, handler) => {
    const events = ["mousedown", "touchstart"];
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    });

    useEffect(() => {
        const listener = event => {
            if (!ref.current ||
                !handlerRef.current ||
                ref.current.contains(event.target)
            ) {
                return;
            }

            handlerRef.current(event);
        };

        events.map(event => document.addEventListener(event, listener));

        return () => {
            events.map(event => document.removeEventListener(event, listener));
        };
    }, []);
};

export default useOnClickOutside;