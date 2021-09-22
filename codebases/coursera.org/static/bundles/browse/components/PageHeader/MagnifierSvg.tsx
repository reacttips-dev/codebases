import React from 'react';

type Props = {
  fill: string;
};

/* eslint-disable max-len */
function MagnifierSvg({ fill }: Props) {
  return (
    <div className="magnifier-wrapper">
      <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-293.000000, -23.000000)">
          <g fill={fill}>
            <g transform="translate(293.000000, 22.000000)">
              <path d="M11.355485,11.4503883 L16.0066609,16.1015642 L15.1015642,17.0066609 L10.4503883,12.355485 C9.34711116,13.2583262 7.93681293,13.8 6.4,13.8 C2.8653776,13.8 0,10.9346224 0,7.4 C0,3.8653776 2.8653776,1 6.4,1 C9.9346224,1 12.8,3.8653776 12.8,7.4 C12.8,8.93681293 12.2583262,10.3471112 11.355485,11.4503883 Z M6.4,12.52 C9.22769792,12.52 11.52,10.2276979 11.52,7.4 C11.52,4.57230208 9.22769792,2.28 6.4,2.28 C3.57230208,2.28 1.28,4.57230208 1.28,7.4 C1.28,10.2276979 3.57230208,12.52 6.4,12.52 Z" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
export default MagnifierSvg;
