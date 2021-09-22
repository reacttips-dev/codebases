// TODO: Update existing code to reference ../types/Content.js

import PropTypes from 'prop-types';

export default PropTypes.shape({
  definition: PropTypes.shape({
    dtdId: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  typeName: PropTypes.oneOf(['cml']).isRequired,
});
