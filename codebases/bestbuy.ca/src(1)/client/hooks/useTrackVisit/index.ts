import * as React from "react";
import {useInView} from "react-intersection-observer";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";

interface UseTrackVisitReturnType {
    ref: (node?: Element | null) => void;
    inView: boolean;
}

interface UseTrackVisitArgs {
    payload: object;
    visibleContentPercent?: number;
    event: string;
    delay?: number;
}

const useTrackVisit = ({payload, event, visibleContentPercent = 1, delay = 0}: UseTrackVisitArgs): UseTrackVisitReturnType => {
    const [impressionTracked, setImpressionTracked] = React.useState(false);
    const threshold = visibleContentPercent / 100;
    const [ref, inView] = useInView({triggerOnce: true, threshold});

    React.useEffect(() => {
        if (!isEmpty(payload) && event && inView && !impressionTracked) {
            setTimeout(() => {
                adobeLaunch.pushEventToDataLayer({
                    event,
                    payload,
                });
                setImpressionTracked(true);
            }, delay);
        }
    }, [inView, payload, event, delay]);

    return {ref, inView};
};

const isEmpty = (payload) => {
    return Object.values(payload).some((value) => value === null || value === undefined);
};

export default useTrackVisit;
