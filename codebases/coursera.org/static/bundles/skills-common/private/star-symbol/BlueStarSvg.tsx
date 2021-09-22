import React from 'react';

type Props = {
  filled?: boolean;
};

const BlueStarSvg: React.FC<Props> = ({ filled }) => {
  return (
    <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
      <path
        d="M16 13.8343C16.0001 13.9766 15.925 14.1081 15.8031 14.1792L8.69694 18.3246C8.57507 18.3957 8.42493 18.3957 8.30306 18.3246L1.19694 14.1792C1.07499 14.1081 0.99991 13.9766 1 13.8343L1 5.5435C0.99991 5.40123 1.07499 5.26974 1.19694 5.1986L8.30306 1.0532C8.42493 0.982113 8.57507 0.982113 8.69694 1.0532L15.8031 5.1986C15.925 5.26974 16.0001 5.40123 16 5.5435V13.8343Z"
        fill={filled ? '#2A73CC' : 'white'}
        stroke="#2A73CC"
        strokeWidth="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.54149 12.2455L5.88125 13.6587L6.38931 10.6655L4.23714 8.54573L7.21137 8.10903L8.54149 5.38574L9.87161 8.10903L12.8458 8.54573L10.6937 10.6655L11.2017 13.6587L8.54149 12.2455Z"
        fill="white"
        stroke="#2A73CC"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default BlueStarSvg;
