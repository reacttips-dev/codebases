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

const FacebookLogoIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-labelledby="facebookLogo"
    aria-hidden="true"
  >
    <title id="facebookLogo">Facebook Logo</title>
    <path
      d="M20 10a10 10 0 10-11.56 9.88v-6.99H5.9V10h2.54V7.8c0-2.5 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46H13.2c-1.24 0-1.63.77-1.63 1.56V10h2.78l-.45 2.89h-2.33v6.99A10 10 0 0020 10z"
      fill={fillColor}
    />
  </svg>
);

FacebookLogoIcon.defaultProps = defaultProps;

export { FacebookLogoIcon };
