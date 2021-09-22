import React from 'react';

export type Props = {
  width?: number;
  height?: number;
};

/**
 * From Vanessa Ho (designer), on why this icon is a one-off and not implemented in CDS:
 *
 *    | I created it new just for sandbox. We don’t have an existing icon.
 *    | I think its okay to implement a new one without adding it to the library
 *    | since its not a functional icon; It's more of a branding icon.
 */
const InteractiveIcon: React.FC<Props> = ({ width = 32, height = 27 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.21875 4.48942H22.7812V1.13525H1.21875V4.48942ZM22.7812 5.20817H1.21875V18.8644H22.7812V5.20817ZM0.5 5.20817V4.48942V1.13525V0.416504H1.21875H22.7812H23.5V1.13525V4.48942V5.20817V18.8644V19.5832H22.7812H1.21875H0.5V18.8644V5.20817ZM3.85417 2.81234C3.85417 3.07697 3.63964 3.2915 3.375 3.2915C3.11036 3.2915 2.89583 3.07697 2.89583 2.81234C2.89583 2.5477 3.11036 2.33317 3.375 2.33317C3.63964 2.33317 3.85417 2.5477 3.85417 2.81234ZM5.29167 3.2915C5.5563 3.2915 5.77083 3.07697 5.77083 2.81234C5.77083 2.5477 5.5563 2.33317 5.29167 2.33317C5.02703 2.33317 4.8125 2.5477 4.8125 2.81234C4.8125 3.07697 5.02703 3.2915 5.29167 3.2915ZM7.6875 2.81234C7.6875 3.07697 7.47297 3.2915 7.20833 3.2915C6.9437 3.2915 6.72917 3.07697 6.72917 2.81234C6.72917 2.5477 6.9437 2.33317 7.20833 2.33317C7.47297 2.33317 7.6875 2.5477 7.6875 2.81234ZM13.1038 8.1893L10.2288 15.3768L10.8962 15.6437L13.7712 8.45624L13.1038 8.1893ZM8.95454 9.50162L9.45354 10.0189L7.48636 11.9165L9.45354 13.8141L8.95454 14.3314L6.4511 11.9165L8.95454 9.50162ZM15.1291 9.50616L17.5441 11.9211L15.0454 14.3314L14.5464 13.8141L16.5184 11.9119L14.6209 10.0144L15.1291 9.50616Z"
        fill="#0056D2"
      />
    </svg>
  );
};

export default InteractiveIcon;
