import {
    useLayoutEffect,
    useState
} from 'react';

/**
 * A matchMedia hook. Pass in a media query string and it returns
 * a boolean if that media query currently applies.
 *
 * @example
 * const matches = useMediaQuery("(min-width: 800px)");
 * // matches is true if screen is >= 800px, false if < 800px
 * @param {string} query
 * @param {boolean} [defaultShow=true]
 */
export default function useMediaQuery(query, defaultShow = true) {
    const [matches, setMatches] = useState();

    useLayoutEffect(() => {
        if (query && typeof window.matchMedia === 'function') {
            const mq = window.matchMedia(query);
            const cb = () => {
                setMatches(mq.matches);
            };
            mq.addListener(cb);
            setMatches(mq.matches);

            return () => {
                mq.removeListener(cb);
            };
        }
        setMatches(defaultShow);
        return undefined;
    }, [query, defaultShow]);

    return matches;
}