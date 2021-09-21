/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import Text from '../Text';

const ErrorBanner = ({ text }) => (
  <div
    css={css`
      border-radius: 6px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(208, 2, 27, 0.1);
    `}
  >
    <Text size="sm" color="#e54751" align="center">
      {text}
    </Text>
  </div>
);

ErrorBanner.propTypes = {
  text: PropTypes.string,
};

export default ErrorBanner;
