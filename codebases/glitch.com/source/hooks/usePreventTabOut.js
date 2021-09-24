import {
    useEffect
} from 'react';

export default function usePreventTabOut(first, last) {
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Tab') {
                if (document.activeElement === first.current && e.shiftKey) {
                    last.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === last.current && !e.shiftKey) {
                    first.current.focus();
                    e.preventDefault();
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [first, last]);
}