import React from 'react';
import { defaultSvgProps } from '../../constants';
import { SvgProps } from '../../types';

const EmailVerified = ({ className }: SvgProps) => (
  <svg
    className={className}
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M34.5184 26.9778H32.6816L3.2 6.1881L1.5763 5.04309C0.913846 4.57593 0 5.04972 0 5.86032V48.2252L1.6 49.837H65.6L67.2 48.2252V5.86032C67.2 5.04972 66.2861 4.57593 65.6237 5.04309L64 6.1881L34.5184 26.9778Z"
      fill="#C9CBCD"
    />
    <path
      d="M4.86351 3.19303L31.1862 21.8592C32.5722 22.8421 34.4278 22.8421 35.8138 21.8592L62.1365 3.19303L64.2036 1.83594C65.0337 1.29093 64.6478 0 63.6547 0H3.34525C2.3522 0 1.9663 1.29093 2.79644 1.83594L4.86351 3.19303Z"
      fill="#C9CBCD"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M65.1849 59.2593C73.3669 59.2593 79.9997 52.6264 79.9997 44.4444C79.9997 36.2624 73.3669 29.6296 65.1849 29.6296C57.0029 29.6296 50.3701 36.2624 50.3701 44.4444C50.3701 52.6264 57.0029 59.2593 65.1849 59.2593Z"
      fill="#36DC5D"
    />
    <path
      d="M57.105 45.1178L61.8188 49.8317L72.5932 39.0572"
      stroke="white"
      strokeWidth="3"
    />
  </svg>
);

EmailVerified.defaultProps = defaultSvgProps;

export { EmailVerified };
