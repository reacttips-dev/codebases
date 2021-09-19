import React from 'react';
import Icon from './Icon';

const PlusCircle = props => (
  <Icon
    viewBox="0 0 24 24"
    width="15"
    height="15"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    aria-hidden={true}
    {...props}>
    <title>Box</title>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="16"/>
    <line x1="8" x2="16" y1="12" y2="12"/>
  </Icon>
);

export default PlusCircle;
