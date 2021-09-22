import React from 'react';

export default React.PropTypes.shape({
  typeName: React.PropTypes.oneOf(['singleLineInput']).isRequired,
  definition: React.PropTypes.shape({
    input: React.PropTypes.string,
  }).isRequired,
});
