import React from 'react';
import PropTypes from 'prop-types';
import Box from '../../../../shared/Box';
import Heading from '../../../../shared/Heading';

import styles from './SceneHeading.sass';

const SceneHeading = ({ title, subtitle }) => (
  <Box
    maxWidth={600}
    marginLeft="auto"
    marginRight="auto"
    marginTop={10}
    marginBottom={subtitle === '' ? 80 : 40}
  >
    <Box>
      <Heading size="sm" align="center" color="#292f36">
        {title}
      </Heading>
    </Box>
    <Box marginTop={10}>
      <Heading size="xs" align="center" color="#7f8287">
        {subtitle}
      </Heading>
    </Box>
  </Box>
);

SceneHeading.defaultProps = {
  title: '',
  subtitle: '',
};

SceneHeading.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default SceneHeading;
