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

const PencilIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <g fill={fillColor} fillRule="nonzero">
        <path d="M0.457142857,11.8857143 L0,16 L4.11428571,15.5428571 L16,3.65714286 L12.3428571,0 L0.457142857,11.8857143 Z M12.6171429,5.10171429 L10.8982857,3.38285714 L12.3428571,1.93828571 L14.0617143,3.65714286 L12.6171429,5.10171429 Z" />
      </g>
    </g>
  </svg>
);

PencilIcon.defaultProps = defaultProps;

export { PencilIcon };
