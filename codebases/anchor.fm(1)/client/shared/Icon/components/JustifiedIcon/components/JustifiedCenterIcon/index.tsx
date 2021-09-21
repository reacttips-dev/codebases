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

const JustifiedCenterIcon = ({
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
        transform="translate(-834 -322)"
        fill={fillColor}
        fillRule="nonzero"
      >
        <g id="Group-20" transform="translate(683 322)">
          <g id="justified_center" transform="translate(151)">
            <path
              d="M36.9444444,5.40012479e-12 L1.05555556,5.40012479e-12 C0.464444444,5.40012479e-12 5.68434189e-14,0.44 5.68434189e-14,1 C5.68434189e-14,1.56 0.464444444,2 1.05555556,2 L36.9444444,2 C37.5355556,2 38,1.56 38,1 C38,0.44 37.5355556,5.40012479e-12 36.9444444,5.40012479e-12 Z"
              id="Shape"
            />
            <path
              d="M31.9642857,8 C32.5442857,8 33,7.56 33,7 C33,6.44 32.5442857,6 31.9642857,6 L5.03571429,6 C4.45571429,6 4,6.44 4,7 C4,7.56 4.45571429,8 5.03571429,8 L31.9642857,8 Z"
              id="Shape"
            />
            <path
              d="M36.9444444,12 L1.05555556,12 C0.464444444,12 5.68434189e-14,12.44 5.68434189e-14,13 C5.68434189e-14,13.56 0.464444444,14 1.05555556,14 L36.9444444,14 C37.5355556,14 38,13.56 38,13 C38,12.44 37.5355556,12 36.9444444,12 Z"
              id="Shape"
            />
            <path
              d="M31.9642857,21 C32.5442857,21 33,20.56 33,20 C33,19.44 32.5442857,19 31.9642857,19 L5.03571429,19 C4.45571429,19 4,19.44 4,20 C4,20.56 4.45571429,21 5.03571429,21 L31.9642857,21 Z"
              id="Shape"
            />
            <path
              d="M36.9444444,25 L1.05555556,25 C0.464444444,25 5.68434189e-14,25.44 5.68434189e-14,26 C5.68434189e-14,26.56 0.464444444,27 1.05555556,27 L36.9444444,27 C37.5355556,27 38,26.56 38,26 C38,25.44 37.5355556,25 36.9444444,25 Z"
              id="Shape"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

JustifiedCenterIcon.defaultProps = defaultProps;

export default JustifiedCenterIcon;
