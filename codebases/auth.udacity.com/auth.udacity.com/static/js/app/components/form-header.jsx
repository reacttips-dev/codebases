import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Text } from '@udacity/veritas-components';

export default function FormHeader({ header, description }) {
  return (
    <div>
      {header && <Heading size="h1">{header}</Heading>}
      {description && <Text>{description}</Text>}
    </div>
  );
}

FormHeader.propTypes = {
  header: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};
