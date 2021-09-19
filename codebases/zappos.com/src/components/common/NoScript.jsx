import React from 'react';
import ReactDOM from 'react-dom/server';
// See https://github.com/jamrizzi/react-noscript for inspiration.
export default function NoScript({ children }) {
  const staticMarkup = ReactDOM.renderToStaticMarkup(children);
  return <noscript dangerouslySetInnerHTML={{ __html: staticMarkup }} />;
}
