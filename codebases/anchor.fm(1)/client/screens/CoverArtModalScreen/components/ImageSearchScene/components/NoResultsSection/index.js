import React from 'react';
import Box from '../../../../../../shared/Box';
import Text from '../../../../../../shared/Text';

const NoResultsHeadingSVG = () => (
  <svg viewBox="0 0 199 111" xmlns="http://www.w3.org/2000/svg">
    <g id="Cover-art---Web" fill="none" fillRule="evenodd">
      <g
        id="Search---No-results"
        transform="translate(-719 -304)"
        fill="#292F36"
      >
        <g id="Group-27" transform="translate(628 304)">
          <g id="Group-8" transform="translate(39)">
            <g id="Group" transform="translate(52)">
              <g id="Group-13" opacity="0.15">
                <ellipse
                  id="Oval-2-Copy-12"
                  cx="25.011"
                  cy="63"
                  rx="11.011"
                  ry="11"
                />
                <ellipse
                  id="Oval-2-Copy-15"
                  cx="188.011"
                  cy="11"
                  rx="11.011"
                  ry="11"
                />
                <ellipse
                  id="Oval-2-Copy-14"
                  cx="4.955"
                  cy="91.95"
                  rx="4.955"
                  ry="4.95"
                />
                <ellipse
                  id="Oval-2-Copy-17"
                  cx="155.955"
                  cy="4.95"
                  rx="4.955"
                  ry="4.95"
                />
                <ellipse
                  id="Oval-2-Copy-9"
                  cx="47.602"
                  cy="103.607"
                  rx="6.602"
                  ry="6.607"
                />
                <ellipse
                  id="Oval-2-Copy-10"
                  cx="167.602"
                  cy="45.607"
                  rx="6.602"
                  ry="6.607"
                />
              </g>
              <path
                d="M148.356226,93.5466017 L118.009985,63.1472912 C121.951068,57.2619552 124.068563,50.3418028 124.068563,43.0961447 C124.068563,33.4543766 120.320509,24.3897737 113.514066,17.5716454 C106.707623,10.7544888 97.6595252,7 88.0342815,7 C78.4090379,7 69.3599703,10.7544888 62.5535272,17.5716454 C55.7480542,24.3897737 52,33.4543766 52,43.0961447 C52,52.7379128 55.7480542,61.8015441 62.5544972,68.6196724 C69.3609403,75.4378007 78.4090379,79.1922894 88.0352515,79.1922894 C95.3499711,79.1922894 102.330043,77.0216042 108.247972,72.9882494 L138.565113,103.355495 C139.588456,104.381567 141.470243,104.158085 142.767124,102.858978 L147.861529,97.7558267 C149.15841,96.4567191 149.380539,94.5717015 148.356226,93.5466017 Z M88.5004892,70 C73.8873567,70 62,58.1126433 62,43.5004892 C62,28.8883351 73.8883351,17 88.5004892,17 C103.112643,17 115,28.8883351 115,43.5004892 C115,58.1126433 103.112643,70 88.5004892,70 Z"
                id="Shape"
                fillOpacity="0.8"
                fillRule="nonzero"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
const NoResultsSection = () => (
  <Box>
    <Box
      display="flex"
      justifyContent="center"
      marginTop={48}
      marginBottom={31}
    >
      <Box width="65%">
        <NoResultsHeadingSVG />
      </Box>
    </Box>
    <Box display="flex" justifyContent="center" marginBottom={14}>
      <Box width="60%">
        <Text size="xl" align="center" color="#292f36">
          We got nothin'.
        </Text>
      </Box>
    </Box>
    <Box display="flex" justifyContent="center">
      <Box width="60%">
        <Text size="md" align="center" color="#292f36">
          Try searching for another image and we’ll see what we can do.
        </Text>
      </Box>
    </Box>
  </Box>
);

export default NoResultsSection;
