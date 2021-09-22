import * as React from "react";
const useExpandContentTransition = (containerRef, bodyRef, isOpen) => {
    const ANIMATION_INT = 500;
    const timeouts = [];
    const [inlineStyle, setInlineStyle] = React.useState({});
    const [open, setOpen] = React.useState(isOpen);
    /**
     * setTransition() sets the height of the container to its current height before applying the
     * open/closed class to the child and extracting the childs target height. It then applies
     * this height to the container triggering the css transition.
     * After the transition interval, the height style is removed and will fall back to use the
     * applied class for styling
     */
    const setTransition = () => {
        const body = bodyRef.current;
        const container = containerRef.current;
        if (body && container) {
            const transition = {
                from: container.scrollHeight,
            };
            setInlineStyle({ height: transition.from + "px" });
            setOpen(isOpen);
            timeouts[0] = window.setTimeout(() => {
                transition.to = body.offsetHeight;
                setInlineStyle({ height: transition.to + "px" });
            }, 0);
            timeouts[1] = window.setTimeout(() => {
                setInlineStyle({});
            }, ANIMATION_INT);
        }
    };
    React.useEffect(() => {
        setTransition();
        return () => timeouts.forEach((t) => window.clearTimeout(t));
    }, [isOpen]);
    return [inlineStyle, open];
};
export default useExpandContentTransition;
//# sourceMappingURL=useExpandContentTransition.js.map