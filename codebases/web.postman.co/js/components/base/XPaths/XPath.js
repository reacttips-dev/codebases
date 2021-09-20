import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import UIEventService from '../../../services/UIEventService';
import { observer } from 'mobx-react';
import { observable, reaction, action } from 'mobx';
import { XPATH_REGISTERED, XPATH_UNREGISTERED } from '../../../constants/UIEventConstants';

/**
 * XPath components can be nested to depict component tree.
 *
 * XPath component also uses reactions on xPath context to react to any change
 * in path or visibility of its ancestors. This also makes sure that even if component
 * is mounted, but not visible, consumers can make sure that this path is not registered until
 * it is actually visible.
 *
 * XPath also emits two events xPathRegistered and xPathUnregistered to announce when the
 * xPath registers/unregisters itself.
 *
 */
@observer
export default class XPath extends Component {
  constructor (props, context) {
    super(props);
    let xPathManager = context.xPathManager;

    // Composing new context by using parents context
    this.xPathManager = observable({
      register: xPathManager && xPathManager.register,
      unregister: xPathManager && xPathManager.unregister,
      path: xPathManager && `${xPathManager.path}/${this.props.identifier}`,
      isVisible: xPathManager && xPathManager.isVisible && props.isVisible
    });

    // reaction for any change in xPath of the parent
    this.disposePathReaction = reaction(() => xPathManager && xPathManager.path, () => {
      this.unregister(this.xPathManager.path);
      this.register(this.props.identifier);
    });

    // reaction for any change in the visibility of parent
    this.disposeVisibilityReaction = reaction(() => xPathManager && xPathManager.isVisible, (isVisible) => {
      this.setIsVisible(this.props.isVisible);
      isVisible ?
      this.register(this.props.identifier) :
      this.unregister(this.xPathManager.path);
    });
  }

  @action
  setIsVisible (isVisible) {
    let xPathManger = this.context.xPathManager;
    this.xPathManager.isVisible = xPathManger && xPathManger.isVisible && isVisible;
  }

  @action
  setNewPath (path) {
    this.xPathManager.path = path;
  }

  getPath (identifier) {
    if (!this.context.xPathManager) {
      return identifier;
    }
    return `${this.context.xPathManager.path}/${identifier}`;
  }

  // registers an xPath with xPathManager and emits xPathRegistered event
  register (identifier) {
    if (!this.xPathManager.isVisible || !this.context.xPathManager) {
      return;
    }
    let path = this.getPath(identifier);
    this.context.xPathManager.register(path, () => findDOMNode(this));
    this.setNewPath(path);
    UIEventService.publish(XPATH_REGISTERED, path);
  }

  // Unregister an xPath with xPathManager and emits xPathUnregistered event
  unregister (path) {
    if (!this.context.xPathManager || !this.context.xPathManager.unregister) {
      return;
    }
    this.context.xPathManager.unregister(path);
    UIEventService.publish(XPATH_UNREGISTERED, path);
  }

  componentDidMount () {
    this.setIsVisible(this.props.isVisible);
    this.register(this.props.identifier);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      this.setIsVisible(nextProps.isVisible);
      nextProps.isVisible ?
      this.register(this.props.identifier) :
      this.unregister(this.xPathManager.path);
    }
    if (this.props.identifier !== nextProps.identifier) {
      this.unregister(this.xPathManager.path);
      this.register(nextProps.identifier);
    }
  }

  componentWillUnmount () {
    this.unregister(this.xPathManager.path);
    this.disposePathReaction && this.disposePathReaction();
    this.disposeVisibilityReaction && this.disposeVisibilityReaction();
  }

  getChildContext () {
    return {
      xPathManager: this.xPathManager
    };
  }

  render () {
    return this.props.children;
  }
}

XPath.contextTypes = { xPathManager: PropTypes.object };
XPath.childContextTypes = { xPathManager: PropTypes.object };
XPath.defaultProps = {
  isVisible: true
};
XPath.propTypes = {
  identifier: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  isVisible: PropTypes.bool
};
