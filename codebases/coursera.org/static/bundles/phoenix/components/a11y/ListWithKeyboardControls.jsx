import React from 'react';
import withKeyboardControls from './withKeyboardControls';

const List = ({ children, onEsc, onEnter, domRef, activateClick, allowDefaultOnEnter, ...props }) => (
  <ul ref={domRef} {...props}>
    {children}
  </ul>
);

const ListWithKeyboardControls = withKeyboardControls(List);

export default ListWithKeyboardControls;
