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

const JustifiedLeftIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 38 27"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g id="Cover-art---Web" fill="none" fillRule="evenodd">
      <g
        id="Add-text"
        transform="translate(-683 -322)"
        fill={fillColor}
        fillRule="nonzero"
      >
        <g id="Group-20" transform="translate(683 322)">
          <g id="justified_left">
            <path
              d="M36.9444444,5.40012479e-12 L1.05555556,5.40012479e-12 C0.464444444,5.40012479e-12 5.68434189e-14,0.44 5.68434189e-14,1 C5.68434189e-14,1.56 0.464444444,2 1.05555556,2 L36.9444444,2 C37.5355556,2 38,1.56 38,1 C38,0.44 37.5355556,5.40012479e-12 36.9444444,5.40012479e-12 Z"
              id="Shape"
            />
            <path
              d="M36.9444444,6 L1.05555556,6 C0.464444444,6 5.68434189e-14,6.44 5.68434189e-14,7 C5.68434189e-14,7.56 0.464444444,8 1.05555556,8 L36.9444444,8 C37.5355556,8 38,7.56 38,7 C38,6.44 37.5355556,6 36.9444444,6 Z"
              id="Shape"
            />
            <path
              d="M36.9444444,12 L1.05555556,12 C0.464444444,12 5.68434189e-14,12.44 5.68434189e-14,13 C5.68434189e-14,13.56 0.464444444,14 1.05555556,14 L36.9444444,14 C37.5355556,14 38,13.56 38,13 C38,12.44 37.5355556,12 36.9444444,12 Z"
              id="Shape"
            />
            <path
              d="M36.9444444,19 L1.05555556,19 C0.464444444,19 5.68434189e-14,19.44 5.68434189e-14,20 C5.68434189e-14,20.56 0.464444444,21 1.05555556,21 L36.9444444,21 C37.5355556,21 38,20.56 38,20 C38,19.44 37.5355556,19 36.9444444,19 Z"
              id="Shape"
            />
            <path
              d="M23.9583333,25 L1.04166667,25 C0.458333333,25 5.68434189e-14,25.44 5.68434189e-14,26 C5.68434189e-14,26.56 0.458333333,27 1.04166667,27 L23.9583333,27 C24.5416667,27 25,26.56 25,26 C25,25.44 24.5416667,25 23.9583333,25 Z"
              id="Shape"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

JustifiedLeftIcon.defaultProps = defaultProps;

export default JustifiedLeftIcon;
