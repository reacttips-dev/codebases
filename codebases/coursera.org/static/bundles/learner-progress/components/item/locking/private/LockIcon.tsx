import React from 'react';
import { color } from '@coursera/coursera-ui';
import { SvgLockFilled } from '@coursera/coursera-ui/svg';

const LockIcon = () => (
  <div className="rc-LockIcon">
    <SvgLockFilled size={35} color={color.lightGrayText} />
  </div>
);

export default LockIcon;
