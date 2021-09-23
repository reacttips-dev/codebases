import {
    useEffect,
    useMemo,
    useState
} from 'react';
import moment from 'moment';

export default function useRelativeTime(timestamp, interval = 5000) {
    const time = useMemo(() => moment(timestamp), [timestamp]);
    const [relativeTime, setRelativeTime] = useState(() => time.fromNow());

    useEffect(() => {
        const id = setInterval(() => {
            setRelativeTime(time.fromNow());
        }, interval);
        return () => {
            clearInterval(id);
        };
    }, [interval, time]);

    return relativeTime;
}