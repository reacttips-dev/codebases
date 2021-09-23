'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UITruncateString from 'UIComponents/text/UITruncateString';
export default function transformSnippetsData(snippets) {
  return snippets ? snippets.get('results').map(function (snippet) {
    return {
      snippet: snippet.toJS(),
      searchText: snippet.get('shortcut'),
      text: snippet.get('name'),
      value: snippet.get('contentId'),
      help: /*#__PURE__*/_jsx(UITruncateString, {
        children: snippet.getIn(['metadata', 'body'])
      })
    };
  }).toArray() : [];
}