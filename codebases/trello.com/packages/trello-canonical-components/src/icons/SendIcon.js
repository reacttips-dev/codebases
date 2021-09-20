/* eslint-disable import/no-default-export */
import React from 'react';

const SendIcon = (props) => (
  <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <path
      fill={props.color || 'currentColor'}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.97825 19.4775C6.97825 20.8483 8.62306 21.5185 9.55451 20.5262L21.5578 7.72363C22.5185 6.69516 21.8025 5 20.409 5H3.49575C2.1784 5 1.50464 6.6071 2.41801 7.57211L6.97825 12.3997V19.4775ZM8.9711 12.6314V18.2121L19.4591 7.02581H4.66483L8.18175 10.7489L11.5762 9.09818C12.073 8.85657 12.6659 9.07559 12.9004 9.58737C13.135 10.0991 12.9223 10.7099 12.4255 10.9515L8.9711 12.6314Z"
    />
  </svg>
);

export default SendIcon;
