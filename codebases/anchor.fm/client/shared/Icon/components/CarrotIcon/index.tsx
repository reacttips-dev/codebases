import React from 'react';

type FillColor = string;
type ClassName = string;

interface IProps {
  fillColor?: FillColor;
  className?: ClassName;
  ariaHidden?: boolean;
  size?: {
    width: number;
    height: number;
  };
}

const CarrotIcon = ({
  fillColor = '#53585E',
  className = '',
  ariaHidden = false,
  size = {
    width: 7,
    height: 11,
  },
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 7 11"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size.width}
    height={size.height}
    aria-hidden={ariaHidden}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(0 -1)" fill={fillColor} stroke={fillColor}>
        <path
          d="M7.81979673,-0.477447568 C8.01262232,-0.679083238 8.01607546,-1.00430091 7.82423651,-1.20730509 L7.58792589,-1.45736924 C7.39755233,-1.65882275 7.09244462,-1.66410529 6.89370485,-1.45581158 L2.73274328,2.90517807 C2.53970914,3.10749185 2.5340035,3.4325817 2.72496982,3.63659667 L6.9014783,8.09848411 C7.09021927,8.30012166 7.39608695,8.30182153 7.58792589,8.09881736 L7.82423651,7.84875321 C8.01461008,7.6472997 8.01951386,7.32399867 7.83350336,7.12483486 L4.23465263,3.27149957 L7.81979673,-0.477447568 Z"
          transform="matrix(-1 0 0 1 8.788 3.212)"
        />
      </g>
    </g>
  </svg>
);

export { CarrotIcon };
