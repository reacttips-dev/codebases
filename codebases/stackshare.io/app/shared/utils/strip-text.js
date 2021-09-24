const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?([a-z0-9-.:]+)(\/.*)*\/?$/gi;

export const stripURL = url => url.replace(regex, '$2');

export const stripTags = str => str.replace(/<\/?[^>]+(>|$)/g, '');
