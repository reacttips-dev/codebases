import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const VolumeOnIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 15"
    className={className}
  >
    <g fill={fillColor} fillRule="nonzero">
      <path d="M10.887.09L5.482 3.309H.739A.727.727 0 0 0 0 4.022v6.83c0 .396.33.716.739.716h4.743l5.405 3.216c.34.203.739.045.739-.714V.806c0-.767-.377-.939-.739-.715zM16.25 7.5a3.75 3.75 0 0 0-2.083-3.358v6.708A3.728 3.728 0 0 0 16.25 7.5zM14.167.192v1.716A5.838 5.838 0 0 1 18.333 7.5a5.838 5.838 0 0 1-4.166 5.592v1.716A7.497 7.497 0 0 0 20 7.5 7.497 7.497 0 0 0 14.167.192zM16.25 7.5a3.75 3.75 0 0 0-2.083-3.358v6.708A3.728 3.728 0 0 0 16.25 7.5z" />
    </g>
  </svg>
);

VolumeOnIcon.defaultProps = defaultProps;

export { VolumeOnIcon };
