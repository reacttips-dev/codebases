import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const PhoneIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 26"
    className={className}
  >
    <path
      fill={fillColor}
      fillRule="nonzero"
      stroke="none"
      strokeWidth="1"
      d="M.286 12.83V2.334C.26 1.774.504 1.232.954.837A2.466 2.466 0 012.66.25h10.7a2.463 2.463 0 011.687.588c.446.392.687.929.667 1.483V23.28c.02.554-.223 1.09-.67 1.482a2.464 2.464 0 01-1.687.586H2.623a2.461 2.461 0 01-1.67-.588c-.441-.389-.682-.919-.667-1.468V12.83zm1.457 8.453h12.506V4.57H1.74l.003 16.713zm7.283 1.865a.907.907 0 00-.308-.707 1.181 1.181 0 00-.792-.297c-.415-.018-.808.166-1.022.479a.887.887 0 000 1.017c.214.313.607.498 1.022.48.292 0 .573-.103.779-.286a.907.907 0 00.318-.686h.003z"
      transform="translate(-229 -455) translate(211 367) translate(0 .72) translate(2.4 76.08) translate(16 11.2)"
    ></path>
  </svg>
);

PhoneIcon.defaultProps = defaultProps;

export { PhoneIcon };
