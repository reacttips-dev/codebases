import React from 'react';
import OutboundLink from './components/OutboundLink';

// returns React children, but not really a component
export default function makeCaptionWithLinks(caption, options = {}) {
  const htmlMatcher = new RegExp('<p|<a|&');
  if (!caption) {
    return "This podcast doesn't have a description yet. Stay tuned!";
  }
  // return early if caption is already HTML
  if (caption.match(htmlMatcher)) {
    return <div dangerouslySetInnerHTML={{ __html: caption }} />;
  }
  const urlMatcher = new RegExp(
    '^(https?://)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&\\/\\/=]*)$'
  );
  const newLineMatch = /\r\n|\r|\n/g;
  const NEWLINE_REPLACEMENT = '____NEW_LINE____';
  const NEWLINE_REPLACEMENT_WITH_SURROUNDING_SPACE = ` ${NEWLINE_REPLACEMENT} `;
  // split by space, or carriage return
  return caption
    .replace(newLineMatch, NEWLINE_REPLACEMENT_WITH_SURROUNDING_SPACE)
    .split(/\s/)
    .reduce(
      makeCaptionLinks({ matcher: urlMatcher, NEWLINE_REPLACEMENT }, options),
      []
    );
}

function makeCaptionLinks({ matcher, NEWLINE_REPLACEMENT }, options) {
  const MAX_VISIBLE_LINK_LENGTH = options.maxVisibleLinkLength;
  return function makeCaptionLink(caption, _url, index) {
    if (_url.indexOf('..') !== -1) {
      // special case regex cannot detect
      addTextToCaption(caption, _url);
      return caption;
    }
    if (matcher.test(_url)) {
      const url = _url.indexOf('://') === -1 ? `http://${_url}` : _url;
      let urlText = url.split('://')[1];
      if (MAX_VISIBLE_LINK_LENGTH) {
        urlText =
          urlText.length > MAX_VISIBLE_LINK_LENGTH
            ? `${urlText.substr(0, MAX_VISIBLE_LINK_LENGTH)}…`
            : urlText;
      }
      caption.push(
        <span key={index}>
          {' '}
          <OutboundLink to={url} newWindow>
            {urlText}
          </OutboundLink>{' '}
        </span>
      );
      caption.push(''); // start another text node
      return caption;
    }
    if (_url === NEWLINE_REPLACEMENT) {
      caption.push(<br />);
      caption.push(''); // start another text node
      return caption;
    }
    addTextToCaption(caption, _url);
    return caption;
  };
}

// by mutation
function addTextToCaption(caption, text) {
  const length = caption.length;
  if (length) {
    caption[length - 1] = `${caption[length - 1]} ${text}`;
    return;
  }
  caption.push(text); // first node
}
