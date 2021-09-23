import React from 'react';
import PropTypes from 'prop-types';

import Box from '../../shared/Box';
import styles from './styles.sass';

const HorizontalRule = ({ marginTop, marginBottom }) => (
  <Box marginTop={marginTop} marginBottom={marginBottom}>
    <hr className={styles.rule} />
  </Box>
);

HorizontalRule.defaultProps = {
  marginTop: null,
  marginBottom: null,
};
HorizontalRule.propTypes = {
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
};
export { HorizontalRule };
