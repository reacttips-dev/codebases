/* eslint-disable import/no-default-export */
import React from 'react';

const CommentIcon = (props) => (
  <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <path
      fill={props.color || 'currentColor'}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 17H12.5L8.28037 20.4014C6.97772 21.4869 5 20.5606 5 18.865V16.1973C3.2066 15.1599 2 13.2208 2 11C2 7.68629 4.68629 5 8 5H16C19.3137 5 22 7.68629 22 11C22 14.3137 19.3137 17 16 17ZM16 7H8C5.79086 7 4 8.79086 4 11C4 12.8638 5.27477 14.4299 7 14.874V19L12 15H16C18.2091 15 20 13.2091 20 11C20 8.79086 18.2091 7 16 7Z"
    />
  </svg>
);

export default CommentIcon;
