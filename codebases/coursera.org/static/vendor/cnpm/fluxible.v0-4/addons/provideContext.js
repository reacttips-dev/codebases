// Coursera modifications
// - Add hoistNonReactStatics, which is available in later versions of fluxible's provideContext
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

import objectAssign from 'vendor/cnpm/object-assign.v3/index';
import contextTypes from '../lib/contextTypes';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

/**
 * Provides context prop to all children as React context
 * @method provideContext
 * @param {React.Component} Component component to wrap
 * @param {object} customContextTypes Custom contextTypes to add
 * @returns {React.Component}
 */
export default function provideContext(Component, customContextTypes) {
    var childContextTypes = objectAssign({}, contextTypes, customContextTypes || {});

    var ContextProvider = createReactClass({
        displayName: 'ContextProvider',

        propTypes: {
            context: PropTypes.object.isRequired
        },

        childContextTypes: childContextTypes,

        getChildContext: function () {
            var childContext = {
                executeAction: this.props.context.executeAction,
                getStore: this.props.context.getStore
            };
            if (customContextTypes) {
                Object.keys(customContextTypes).forEach(function (key) {
                    childContext[key] = this.props.context[key];
                }, this);
            }
            return childContext;
        },

        render: function () {
            return React.createElement(Component, this.props);
        }
    });
    hoistNonReactStatics(ContextProvider, Component);

    return ContextProvider;
};
