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

const GooglePlayLogoIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16.99855 18.322"
    className={className}
    aria-label="Google Play Logo"
    aria-hidden="true"
  >
    <defs />
    <path
      d="M.65667,1.0926a1.67451,1.67451,0,0,0-.15595.71564v16.3822a1.67278,1.67278,0,0,0,.15583.71576L9.67413,9.99934Z"
      transform="translate(-.5 -.839)"
      fill={fillColor}
    />
    <path
      d="M16.71288,8.86793l-3.094-1.73614L10.71551,9.9994l2.8233,2.78894,3.17407-1.78113C17.76141,10.41829,17.76141,9.45607,16.71288,8.86793Z"
      transform="translate(-.5 -.839)"
      fill={fillColor}
    />
    <path
      d="M1.4497,19.15107a1.22656,1.22656,0,0,0,.77734-.19433l10.53321-5.90918-2.56543-2.53418Z"
      transform="translate(-.5 -.839)"
      fill={fillColor}
    />
    <path
      d="M2.228,1.04072A1.26035,1.26035,0,0,0,1.4497.84736L10.19457,9.4853l.00025-.00024.00024.00024,2.56519-2.53344Z"
      transform="translate(-.5 -.839)"
      fill={fillColor}
    />
  </svg>
);

GooglePlayLogoIcon.defaultProps = defaultProps;

export default GooglePlayLogoIcon;
