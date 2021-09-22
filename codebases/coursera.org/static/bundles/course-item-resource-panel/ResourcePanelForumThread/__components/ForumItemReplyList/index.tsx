import React from 'react';
import 'css!./__styles__/ForumItemReplyList';

export default function ForumItemReplyList({ children }: { children: JSX.Element | JSX.Element[] }) {
  let nodes;
  if (Array.isArray(children)) {
    nodes = children;
  } else {
    nodes = [children];
  }
  return (
    <ul className="rc-ForumItemReplyList__list">
      {nodes.map((child, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={`forumItemReplyList-${index}`} className="rc-ForumItemReplyList__list__node">
          {child}
        </li>
      ))}
    </ul>
  );
}
