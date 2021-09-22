export default ({getState}) => (next) => (action) => {
    next(action);
    if (typeof window !== "undefined") {
        const event = new CustomEvent("analytics-event", {
            detail: {event: action.type, payload: action.payload, state: getState()},
        });
        document.dispatchEvent(event);
    }
};
