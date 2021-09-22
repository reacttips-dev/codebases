import * as React from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export interface TimeFormat {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const formatTime = (time: number): TimeFormat => ({
    days: time >= 0 ? Math.floor(time / DAY) : 0,
    hours: time >= 0 ? Math.floor((time % DAY) / HOUR) : 0,
    minutes: time >= 0 ? Math.floor((time % HOUR) / MINUTE) : 0,
    seconds: time >= 0 ? Math.floor((time % MINUTE) / SECOND) : 0,
});

const getRemainingTime = (toDate: Date) => {
    const globalOffset = (typeof window !== "undefined" && window.globalDateOffset) || 0;
    return toDate.getTime() - new Date().getTime() + globalOffset;
};

const countdownHook = (toDate: Date): TimeFormat => {
    const [timer, setTimerState] = React.useState(formatTime(getRemainingTime(toDate)));
    let interval: number = 0;

    const setTimer = (remainingTime: number) => {
        if (remainingTime >= 0) {
            const formattedTime = formatTime(remainingTime);
            setTimerState(formattedTime);
        }
    };

    React.useEffect(() => {
        const remainingTime = getRemainingTime(toDate);
        if (remainingTime >= 0) {
            setTimer(remainingTime);
            interval = window.setInterval(() => {
                setTimer(getRemainingTime(toDate));
            }, SECOND);
        }
        return () => window.clearInterval(interval);
    }, []);

    return timer;
};

export default countdownHook;
