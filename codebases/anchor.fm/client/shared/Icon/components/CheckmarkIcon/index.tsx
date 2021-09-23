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

const CheckmarkIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 28 22"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
  >
    <defs>
      <path
        d="M183.342655,105.525136 L184.182104,104.667963 C184.645812,104.194465 185.405568,104.186528 185.879067,104.650236 C185.884639,104.655693 185.890158,104.661204 185.895623,104.666769 L190.5916,109.448536 C191.055968,109.921388 191.815735,109.928265 192.288586,109.463897 C192.294151,109.458432 192.299662,109.452913 192.305119,109.447341 L204.14216,97.3603821 C204.605868,96.8868833 205.365625,96.8789466 205.839123,97.342655 C205.846103,97.3494909 205.853,97.3564117 205.859811,97.3634159 L206.704,98.231542 C207.158073,98.6984906 207.156759,99.4424032 206.701039,99.9077448 L192.306314,114.60639 C191.842605,115.079889 191.082849,115.087825 190.60935,114.624117 C190.603379,114.61827 190.59747,114.61236 190.591623,114.60639 L183.342655,107.204372 C182.885782,106.737853 182.885782,105.991655 183.342655,105.525136 Z"
        id="path-1"
      />
      <filter
        x="-10.8%"
        y="-8.9%"
        width="121.6%"
        height="128.9%"
        filterUnits="objectBoundingBox"
        id="filter-2"
      >
        <feMorphology
          radius="0.6"
          operator="dilate"
          in="SourceAlpha"
          result="shadowSpreadOuter1"
        />
        <feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="0.5"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feComposite
          in="shadowBlurOuter1"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          in="shadowBlurOuter1"
        />
      </filter>
    </defs>
    <g id="Cover-art---Web" fill="none" fillRule="evenodd">
      <g id="Search---default" transform="translate(-809 -365)">
        <g id="Group-27" transform="translate(628 269)">
          <g id="Group-20" transform="translate(0 .2)">
            <g id="Selected_color_swatch">
              <use fill="#000" filter="url(#filter-2)" xlinkHref="#path-1" />
              <path
                strokeOpacity="0.1"
                stroke="#000"
                strokeWidth="0.6"
                d="M183.128318,105.315231 L183.967767,104.458059 C184.547403,103.866185 185.497098,103.856264 186.088972,104.4359 C186.099386,104.446165 186.099386,104.446165 186.109666,104.456565 L190.805643,109.238333 C191.153919,109.592972 191.723744,109.598129 192.078383,109.249853 C192.084623,109.243685 192.084623,109.243685 192.090782,109.237437 L203.927823,97.1504775 C204.507459,96.5586041 205.457154,96.5486832 206.049028,97.1283187 C206.062063,97.141189 206.062063,97.141189 206.074887,97.1542698 L206.919076,98.0223959 C207.486668,98.6060816 207.485026,99.5359723 206.915376,100.117649 L192.52065,114.816294 C191.941015,115.408168 190.991319,115.418089 190.399445,114.838453 C190.388289,114.827451 190.388289,114.827451 190.377287,114.816294 L183.128318,107.414277 C182.557227,106.831128 182.557227,105.89838 183.128318,105.315231 Z"
                fill={fillColor}
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

CheckmarkIcon.defaultProps = defaultProps;

export default CheckmarkIcon;
