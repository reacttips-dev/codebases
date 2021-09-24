import {
    useEffect
} from 'react';

export default function useClickOut(ref, onClickOut) {
    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClickOut();
            }
        };
        document.addEventListener('click', onClick);
        return () => {
            document.removeEventListener('click', onClick);
        };
    }, [ref, onClickOut]);
}