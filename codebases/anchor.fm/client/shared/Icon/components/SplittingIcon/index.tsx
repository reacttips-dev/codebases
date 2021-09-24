import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const SplittingIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg viewBox="0 0 18 12" className={className}>
    <g fill="none" fillRule="evenodd" strokeWidth="1" stroke="none">
      <g transform="translate(0.000000, -3.000000)">
        <g>
          <g transform="translate(0.000000, 3.000000)" fill={fillColor}>
            <path
              d="M11.4812747,0.279118182 C11.2957205,0.124965467 11.1452991,0.200887827 11.1452991,0.439580093 L11.1452991,11.1343844 C11.1452991,11.3771578 11.29079,11.4530951 11.4812747,11.2948463 L17.7751355,6.06610043 C17.9606897,5.91194772 17.9656202,5.6661129 17.7751355,5.50786407 L11.4812747,0.279118182 Z"
              id="icon-play-23"
            />
            <path
              d="M0.523173919,0.279478694 C0.337619724,0.125325978 0.187198329,0.201248338 0.187198329,0.439940605 L0.187198329,11.1347449 C0.187198329,11.3775183 0.332689212,11.4534557 0.523173919,11.2952068 L6.8170347,6.06646094 C7.0025889,5.91230823 7.00751941,5.66647341 6.8170347,5.50822458 L0.523173919,0.279478694 Z"
              transform="translate(3.576505, 5.787163) rotate(-180.000000) translate(-3.576505, -5.787163) "
            />
          </g>
          <rect x="0" y="0" width="18" height="18" />
        </g>
      </g>
    </g>
  </svg>
);

SplittingIcon.defaultProps = defaultProps;

export { SplittingIcon };
