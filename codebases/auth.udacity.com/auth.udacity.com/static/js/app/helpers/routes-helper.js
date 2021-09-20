import qs from 'qs';
import {
    config
} from 'config';

function isAbsoluteUrl(url) {
    return url.indexOf('http') === 0;
}

const getQueryParam = (location, name) => {
    let search = location.search;
    search = search[0] === '?' ? search.slice(1) : search;
    return qs.parse(search)[name];
};

const getOrigin = () => {
    const {
        location
    } = window;

    return location.origin || `${location.protocol}//${location.host}`;
};

const getNext = (reactRouterLocation) => {
    const next = getQueryParam(reactRouterLocation, 'next');

    if (!next) {
        return config.REDIRECT_URL;
    } else if (isAbsoluteUrl(next)) {
        return next;
    } else {
        return `${getOrigin()}${next[0] === '/' ? '' : '/'}${next}`;
    }
};

export default {
    getQueryParam,
    getNext,
    getOrigin
};