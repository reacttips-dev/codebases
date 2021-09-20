import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import KeyMapMixin from './KeyMapMixin';
import PropTypes from 'prop-types';
import ActiveViewManager from '../../../modules/view-manager/ActiveViewManager';
import { PageService } from '../../../../appsdk/services/PageService';

let isBrowser = (window.SDK_PLATFORM === 'browser');

function getSequencesFromMap (hotKeyMap, hotKeyName) {
  const sequences = hotKeyMap[hotKeyName];

  // If no sequence is found with this name we assume
  // the user is passing a hard-coded sequence as a key
  if (!sequences) {
    return [hotKeyName];
  }

  if (_.isArray(sequences)) {
    return sequences;
  }

  return [sequences];
}

class KeyMaps extends Component {
  constructor (props) {
    super(props);

    this.currentElement = null;
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);
  }

  getChildContext () {
    return { hotKeyParent: this };
  }

  /**
   * Brings back the focus to the current KeyMap component,
   * when the focus is lost from any child element
   * @param {Object} event
   */
  handleFocusOut (event) {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = setTimeout(() => {
      this.timeoutHandle = null;

      if (document.activeElement === document.body) {
        this.currentElement && this.currentElement.focus();
      }
    });
  }

  componentDidMount () {
    this.currentElement = ReactDOM.findDOMNode(this);

    // import is here to support React's server rendering as Mousetrap immediately
    // calls itself with window and it fails in Node environment
    const Mousetrap = require('mousetrap');

    Mousetrap.prototype.stopCallback = function (e, element, combo) {
      return pm.app.get('shortcutsDisabled');
    };

    // Not optimal - imagine hundreds of this component. We need a top level
    // delegation point for mousetrap
    this.__mousetrap__ = new Mousetrap(
      this.props.attach || this.currentElement
    );

    this.updateKeyMaps(true);

    if (this.currentElement) {
      this.currentElement.addEventListener('focusout', this.handleFocusOut);
    }
  }

  componentDidUpdate (prevProps) {
    this.updateKeyMaps(false, prevProps);
  }

  componentWillUnmount () {
    if (this.context.hotKeyParent) {
      this.context.hotKeyParent.childHandledSequence(null);
    }

    if (this.__mousetrap__) {
      this.__mousetrap__.reset();
    }

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    if (this.currentElement) {
      this.currentElement.removeEventListener('focusout', this.handleFocusOut);
    }
  }

  updateKeyMaps (force = false, prevProps = {}) {
    const { handlers = {}, allowedViews, allowedPages } = this.props,
          { handlers: prevHandlers = handlers } = prevProps;

    // Ensure map is up-to-date to begin with
    // We will only bother continuing if the map was actually updated
    if (!force && _.isEqual(handlers, prevHandlers) && !this.props.updateMap()) {
      return;
    }

    const hotKeyMap = this.props.getMap();
    const sequenceHandlers = [];
    const mousetrap = this.__mousetrap__;

    // Group all our handlers by sequence
    _.forEach(handlers, (handler, hotKey) => {
      const handlerSequences = getSequencesFromMap(hotKeyMap, hotKey);

      // Could be optimized as every handler will get called across every bound
      // component - imagine making a node a focus point and then having hundreds!
      _.forEach(handlerSequences, (sequence) => {
        let action;

        const callback = (event, sequence) => {
          // If the active view does not match with the allowed views where the current shortcut
          // should be activated, then bail out
          if (!this._shouldTriggerShortcut(hotKey, allowedViews, allowedPages)) {
            return;
          }

          // Check we are actually in focus and that a child hasn't already handled this sequence
          const isFocused = _.isBoolean(this.props.focused) ?
            this.props.focused :
            this.__isFocused__;

          if (isFocused && sequence !== this.__lastChildSequence__) {
            if (this.context.hotKeyParent) {
              this.context.hotKeyParent.childHandledSequence(sequence);
            }

            // If we are running on the browser, we check if the browser action needs to be suppressed.
            // In this case, we need to call event.preventDefault()
            if (isBrowser && pm.shortcuts.shouldOverrideBrowser(hotKey)) {
              return (() => {
                event.preventDefault();
                return handler(event, sequence);
              })();
            }

            return handler(event, sequence);
          }
        };

        if (_.isObject(sequence)) {
          action = sequence.action;
          sequence = sequence.sequence;
        }

        sequenceHandlers.push({
          callback,
          action,
          sequence
        });
      });
    });

    // Hard reset our handlers (probably could be more efficient)
    mousetrap.reset();
    _.forEach(sequenceHandlers, (handler) => {
      return mousetrap.bind(handler.sequence, handler.callback, handler.action);
    });
  }

  _shouldTriggerShortcut (hotKey, allowedViews, allowedPages) {

    // By default allow all shortcuts if a criteria was not given to restrict it
    if (!allowedViews && !allowedPages) {
      return true;
    }

    let isAllowedInThisView = true,
        isAllowedInThisPage = true;

    // check if allowed views are provided or not
    if (allowedViews) {
      let allowedViewsForHotKey;

      // if the value is provided as object, get the views for this particular hotkey
      if (!Array.isArray(allowedViews)) {
        allowedViewsForHotKey = allowedViews[hotKey];
      }
      else {
        // if the value is provided as an array, it applies to all of the hotkeys, so simply assign it to this hotkey
        allowedViewsForHotKey = allowedViews;
      }

      // if any array of views is associated with this hotkey, we do the inner processing or else
      // we assume that this hotkey has no view restrictions
      if (allowedViewsForHotKey) {
        let allowedViewsSet = new Set(allowedViewsForHotKey);
        isAllowedInThisView = allowedViewsSet.has(ActiveViewManager.activeView);

        // if the current view is not supported, bail out. No need to perform the
        // next level of processing.
        if (!isAllowedInThisView) {
          return false;
        }
      }
    }

    // if any allowedPages is provided, then perform the inner processing
    if (allowedPages) {
      // get the allow pages for this particular hotkey
      let allowedPagesForHotKey = allowedPages[hotKey];

      // if the array is empty, assume it to be allowed in all pages
      if (!_.isEmpty(allowedPagesForHotKey)) {
        let currentPage = PageService.activePage;
        isAllowedInThisPage = _.includes(allowedPagesForHotKey, currentPage);
      }
    }

    return isAllowedInThisPage;
  }

  childHandledSequence (sequence = null) {
    this.__lastChildSequence__ = sequence;

    // Traverse up any hot key parents so everyone is aware a child has handled a certain sequence
    if (this.context.hotKeyParent) {
      this.context.hotKeyParent.childHandledSequence(sequence);
    }
  }

  focus () {
    let node = ReactDOM.findDOMNode(this);
    node && node.focus();
  }

  onFocus () {
    this.__isFocused__ = true;

    if (this.props.onFocus) {
      this.props.onFocus(...arguments);
    }
  }

  onBlur () {
    this.__isFocused__ = false;

    if (this.props.onBlur) {
      this.props.onBlur(...arguments);
    }
    if (this.context.hotKeyParent) {
      this.context.hotKeyParent.childHandledSequence(null);
    }
  }

  render () {
    let child = React.Children.only(this.props.children);

    return React.cloneElement(child, {
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      tabIndex: '-1'
    });
  }
}

KeyMaps.propTypes = {
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  keyMap: PropTypes.object,
  handlers: PropTypes.object,
  allowedViews: PropTypes.oneOfType([
    // can provide the criteria per shortcut
    // {shortcutName1: [view1], shortcutName2: [view2]}
    PropTypes.object,

    // or a criteria common to all shortcuts
    // [view1, view2, ...]
    PropTypes.arrayOf(PropTypes.string)
  ]),
  allowedPages: PropTypes.oneOfType([
    // can provide the criteria per shortcut
    // {shortcutName1: [view1], shortcutName2: [view2]}
    PropTypes.object
  ]),
  focused: PropTypes.bool, // externally controlled focus
  attach: PropTypes.any // dom element to listen for key events
};

KeyMaps.contextTypes = { hotKeyParent: PropTypes.any };

KeyMaps.childContextTypes = { hotKeyParent: PropTypes.any };

export default KeyMapMixin(KeyMaps);
