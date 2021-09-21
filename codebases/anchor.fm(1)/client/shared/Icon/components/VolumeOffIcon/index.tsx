import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const VolumeOffIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 15"
    className={className}
  >
    <path
      fill={fillColor}
      fillRule="nonzero"
      d="M10.887.09L5.482 3.309H.739A.727.727 0 0 0 0 4.022v6.83c0 .396.33.716.739.716h4.743l5.405 3.216c.34.203.739.045.739-.714V.806c0-.767-.377-.939-.739-.715z"
    />
  </svg>
);

VolumeOffIcon.defaultProps = defaultProps;

export { VolumeOffIcon };
