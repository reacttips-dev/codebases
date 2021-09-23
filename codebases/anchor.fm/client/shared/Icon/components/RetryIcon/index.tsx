import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const RetryIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 24"
    className={className}
  >
    <g fill={fillColor} fillRule="evenodd">
      <path
        stroke={fillColor}
        strokeWidth=".568"
        d="M10.178 3.884V5.78h2.73V3.884h-2.73z"
      />
      <g fillRule="nonzero">
        <path d="M19.789 13.458c0 5.445-4.43 9.858-9.895 9.858C4.43 23.316 0 18.903 0 13.458S4.43 3.6 9.894 3.6v2.464c-4.098 0-7.42 3.31-7.42 7.394s3.322 7.394 7.42 7.394c4.099 0 7.421-3.31 7.421-7.394h2.474zM13.192 3.6h1.649v1.643h-1.649z" />
        <path d="M11.798.156L16.85 5.21l-1.743 1.743L10.055 1.9z" />
        <path d="M14.83 3.188l2.02 2.021L12.2 9.86 10.18 7.838z" />
      </g>
    </g>
  </svg>
);

RetryIcon.defaultProps = defaultProps;

export { RetryIcon };
