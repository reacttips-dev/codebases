import React from 'react';

type FillColor = string;
type ClassName = string;

interface IProps {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const TwitterLogoIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-labelledby="twitterLogo"
    aria-hidden="true"
  >
    <title id="twitterLogo">Twitter Logo</title>
    <path
      d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zM8.17 15.27a6.81 6.81 0 006.86-6.86v-.3c.46-.35.87-.77 1.2-1.26-.43.2-.9.32-1.39.38.5-.3.88-.77 1.06-1.33-.46.27-.98.47-1.53.58a2.41 2.41 0 00-4.1 2.2c-2-.1-3.78-1.06-4.97-2.52a2.42 2.42 0 00.75 3.22c-.4-.01-.77-.12-1.09-.3v.03c0 1.17.83 2.14 1.93 2.36a2.4 2.4 0 01-1.09.04 2.4 2.4 0 002.25 1.68 4.85 4.85 0 01-3.57 1 6.72 6.72 0 003.69 1.08z"
      fill={fillColor}
    />
  </svg>
);

TwitterLogoIcon.defaultProps = defaultProps;

export { TwitterLogoIcon };
