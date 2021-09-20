import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';

// HACK: (React) remove once we've migrated other packages to be 16 compatible
window.React = React;
React.createClass = createReactClass;
React.PropTypes = PropTypes;