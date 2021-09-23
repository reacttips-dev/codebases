import React from 'react';

type FillColor = string;
type ClassName = string;

interface IProps {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#FFFFFF',
};

const FacebookLogoSimpleIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 9 15"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
  >
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      fillOpacity="0.8"
    >
      <g transform="translate(-1310.000000, -510.000000)" fill={fillColor}>
        <g transform="translate(1153.000000, 501.000000)">
          <g transform="translate(48.000000, 0.000000)">
            <path d="M114.747331,16.9252966 L117.182043,16.9252966 L117.546607,14.4296472 L114.747331,14.4296472 L114.747331,12.8363327 C114.747331,12.1137846 114.974602,11.6213919 116.148241,11.6213919 L117.645161,11.6208145 L117.645161,9.38868562 C117.386275,9.358272 116.497687,9.29032258 115.463884,9.29032258 C113.305647,9.29032258 111.82806,10.4533549 111.82806,12.5891739 L111.82806,14.4296472 L109.387097,14.4296472 L109.387097,16.9252966 L111.82806,16.9252966 L111.82806,23.3290323 L114.747331,23.3290323 L114.747331,16.9252966 Z"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

FacebookLogoSimpleIcon.defaultProps = defaultProps;

export { FacebookLogoSimpleIcon };
