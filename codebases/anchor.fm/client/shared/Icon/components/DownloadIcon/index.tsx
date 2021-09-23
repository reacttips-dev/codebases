import React from 'react';
import { SvgProps } from '../../types/index.d';

export function DownloadIcon({
  fillColor = '#53585E',
  className,
  ariaHidden,
}: SvgProps) {
  return (
    <svg
      viewBox="0 0 14 17"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      aria-hidden={ariaHidden}
    >
      <defs>
        <polygon id="path-1" points="0 0 8.75 0 8.75 14.4 0 14.4" />
      </defs>
      <g id="Cover-art---Web" fill="none" fillRule="evenodd">
        <g id="Finalize-cover-art" transform="translate(-547 -583)">
          <g id="Group-32" transform="translate(545 581)">
            <g id="export">
              <rect
                id="Rectangle"
                fill={fillColor}
                x="2"
                y="16"
                width="14"
                height="2.25"
                rx="1.125"
              />
              <g id="Group-5" transform="matrix(1 0 0 -1 4.625 15.4)">
                <mask id="mask-2" fill="#fff">
                  <use xlinkHref="#path-1" />
                </mask>
                <path
                  d="M3.36504808,3.53309885 L3.36504808,11.5653166 C3.36504808,12.1371516 3.81735577,12.6 4.37466346,12.6 C4.93264423,12.6 5.38427885,12.1371516 5.38427885,11.5653166 L5.38427885,3.53309885 L7.02658654,5.21549403 C7.22379808,5.41760218 7.48225962,5.51831137 7.74004808,5.51831137 C7.99850962,5.51831137 8.25697115,5.41760218 8.45418269,5.21549403 C8.84860577,4.81196751 8.84860577,4.15597825 8.45418269,3.75245173 L5.08947115,0.304196914 C4.99524038,0.207626465 4.88283654,0.131059895 4.75899038,0.078635937 C4.62841346,0.0275915568 4.50524038,0 4.37466346,0 C4.24475962,0 4.12158654,0.0275915568 4.00716346,0.0738074145 C3.86716346,0.131059895 3.75475962,0.207626465 3.66052885,0.304196914 L0.295817308,3.75245173 C-0.0986057692,4.15597825 -0.0986057692,4.81196751 0.295817308,5.21549403 C0.690240385,5.61971034 1.32899038,5.61971034 1.72341346,5.21549403 L3.36504808,3.53309885 Z"
                  id="Fill-3"
                  fill={fillColor}
                  mask="url(#mask-2)"
                />
              </g>
              <rect id="Rectangle-2" y="1" width="18" height="18" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
