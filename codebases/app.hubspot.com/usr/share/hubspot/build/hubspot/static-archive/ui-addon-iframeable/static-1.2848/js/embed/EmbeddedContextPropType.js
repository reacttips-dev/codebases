'use es6';

import PropTypes from 'prop-types';
var EmbeddedContextPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  app: PropTypes.shape({
    info: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  sendMessage: PropTypes.func.isRequired,
  sendReplyMessage: PropTypes.func.isRequired,
  sendDirectedMessage: PropTypes.func.isRequired,
  sendBroadcastMessage: PropTypes.func.isRequired,
  sendBroadcastReplyMessage: PropTypes.func.isRequired
}).isRequired;
export default EmbeddedContextPropType;