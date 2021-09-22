import React from 'react';

export default React.PropTypes.shape({
  typeName: React.PropTypes.oneOf(['options']).isRequired,
  definition: React.PropTypes.shape({
    choice: React.PropTypes.string,
  }).isRequired,
});
