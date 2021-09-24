import {
    useEffect
} from 'react';

export function fromSelf(e) {
    return e.origin === window.location.origin;
}

export function fromSelfOrParent(e) {
    return fromSelf(e) || e.source === window.parent;
}

export default function useMessageHandler(permitted, type, handler) {
    useEffect(() => {
        const onMessage = (event) => {
            if (!permitted(event)) {
                return;
            }
            const {
                data
            } = event;
            if (data.type === type) {
                handler(data);
            }
        };
        window.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, [permitted, type, handler]);
}