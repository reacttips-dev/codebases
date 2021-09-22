/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import createReactClass from 'create-react-class';
import contextTypes from '../lib/contextTypes';

var FluxibleComponent = createReactClass({
    displayName: 'FluxibleComponent',
    propTypes: {
        context: PropTypes.object.isRequired
    },

    childContextTypes: contextTypes,

    /**
     * Provides the current context as a child context
     * @method getChildContext
     */
    getChildContext: function () {
        return {
            getStore: this.props.context.getStore,
            executeAction: this.props.context.executeAction
        };
    },

    render: function () {
        return React.cloneElement(this.props.children, {
            context: this.props.context
        });
    }
});

export default FluxibleComponent;
