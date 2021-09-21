import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const LaptopIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 22"
    className={className}
  >
    <g
      fill={fillColor}
      fillRule="evenodd"
      stroke="none"
      strokeWidth="1"
      transform="translate(-224 -529) translate(211 367) translate(0 .72) translate(0 147.6) translate(13.2 14.4)"
    >
      <path
        fillRule="nonzero"
        d="M22.286 16.047V.767A.775.775 0 0021.503 0H.783A.775.775 0 000 .767v15.28c0 .424.35.767.783.767h7.802v2.453H6.106V20.8H16.18v-1.533H13.7v-2.453h7.803a.775.775 0 00.783-.767zm-10.152 3.22h-1.983v-2.453h2.01l-.027 2.453zm8.586-3.986H1.566v-2.3H20.72v2.3zm0-3.833H1.566V1.533H20.72v9.915z"
      ></path>
      <path d="M1.486 11.886H20.8V16.343H1.486z"></path>
      <path d="M8.914 14.857H13.370999999999999V19.314H8.914z"></path>
    </g>
  </svg>
);

LaptopIcon.defaultProps = defaultProps;

export { LaptopIcon };
