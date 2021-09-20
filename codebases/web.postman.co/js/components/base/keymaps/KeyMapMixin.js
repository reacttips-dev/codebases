import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default (ComposedComponent) => {
  class KeyMapWrapper extends Component {
    constructor (props) {
      super(props);
      this.updateMap = this.updateMap.bind(this);
      this.getMap = this.getMap.bind(this);
    }

    UNSAFE_componentWillMount () {
      this.updateMap();
    }

    updateMap () {
      const newMap = this.buildMap();

      if (!_.isEqual(newMap, this.__hotKeyMap__)) {
        this.__hotKeyMap__ = newMap;
        return true;
      }

      return false;
    }

    buildMap () {
      const parentMap = this.context.hotKeyMap || {};
      const thisMap = this.props.keyMap || {};

      return _.assign({}, parentMap, thisMap);
    }

    getChildContext () {
      return { hotKeyMap: this.__hotKeyMap__ };
    }

    getMap () {
      return this.__hotKeyMap__;
    }

    focus () {
      _.isFunction(this.refs.ComposedComponent.focus) && this.refs.ComposedComponent.focus();
    }

    render () {
      return (
        <ComposedComponent
          ref='ComposedComponent'
          getMap={this.getMap}
          updateMap={this.updateMap}
          {...this.props}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  }

  KeyMapWrapper.contextTypes = { hotKeyMap: PropTypes.object };

  KeyMapWrapper.childContextTypes = { hotKeyMap: PropTypes.object };

  return KeyMapWrapper;
};
