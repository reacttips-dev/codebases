import React from 'react';

type FillColor = string;
type ClassName = string;

interface Props {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const YoutubeIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 13"
    className={className}
  >
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M6.8 8.66v-4.9l4.24 2.45L6.8 8.66zm9.44-6.45A2.06 2.06 0 0014.81.75C13.54.4 8.46.4 8.46.4S3.37.4 2.1.75C1.4.94.85 1.5.67 2.2c-.34 1.3-.34 4-.34 4s0 2.7.34 3.99c.18.71.73 1.27 1.43 1.47 1.27.34 6.36.34 6.36.34s5.08 0 6.35-.34c.7-.2 1.25-.76 1.43-1.47.34-1.3.34-4 .34-4s0-2.7-.34-3.99z"
    />
  </svg>
);

YoutubeIcon.defaultProps = defaultProps;

export { YoutubeIcon };
