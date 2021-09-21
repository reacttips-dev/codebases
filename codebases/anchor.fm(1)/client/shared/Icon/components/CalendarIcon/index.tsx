import React from 'react';
import { defaultSvgProps } from '../../constants';
import { SvgProps } from '../../types';

const CalendarIcon = ({ className, fillColor }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      className={className}
    >
      <g fill={fillColor} fillRule="evenodd">
        <path d="M2 2.45h14a2 2 0 0 1 2 2v2.1H0v-2.1c0-1.1.9-2 2-2zM0 8.18h18V16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.18z" />
        <rect width="2.45" height="4.91" x="4.09" rx="1" />
        <rect width="2.45" height="4.91" x="11.45" rx="1" />
      </g>
    </svg>
  );
};

CalendarIcon.defaultProps = defaultSvgProps;

export { CalendarIcon };
