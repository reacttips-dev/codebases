'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import emptyFunction from 'react-utils/emptyFunction';
import ComponentWithWindowListeners from 'UIComponents/mixins/ComponentWithWindowListeners';
var SignatureIframe = createReactClass({
  displayName: "SignatureIframe",
  mixins: [ComponentWithWindowListeners],
  propTypes: {
    className: PropTypes.string,
    content: PropTypes.string.isRequired,
    frameBorder: PropTypes.number,
    onClick: PropTypes.func,
    sandbox: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['allow-forms', 'allow-modals', 'allow-orientation-lock', 'allow-pointer-lock', 'allow-popups', 'allow-popups-to-escape-sandbox', 'allow-presentation', 'allow-same-origin', 'allow-scripts', 'allow-top-navigation'])]),
    scrolling: PropTypes.oneOf(['auto', 'no', 'yes']),
    style: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      content: '',
      frameBorder: 0,
      onClick: emptyFunction,
      sandbox: 'allow-same-origin',
      scrolling: 'no'
    };
  },
  getInitialState: function getInitialState() {
    return {
      iframeInnerHeight: 0,
      iframeContents: null
    };
  },
  componentDidMount: function componentDidMount() {
    this.writeIframeContents(this.props.content);
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.writeIframeContents(this.props.content);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.getFullHeightTimeout) {
      clearTimeout(this.getFullHeightTimeout);
    }

    if (this.iframeInnerHeightTimeout) {
      clearTimeout(this.iframeInnerHeightTimeout);
    }

    if (this.iframeContentsTimeout) {
      clearTimeout(this.iframeContentsTimeout);
    }
  },
  getWindowListeners: function getWindowListeners() {
    return {
      resize: this.getFullHeight
    };
  },
  writeIframeContents: function writeIframeContents(iframeContents) {
    var _this = this;

    if (!iframeContents) {
      return;
    }

    var iframeDoc = this.iframeContentDocument;

    if (iframeDoc && (iframeDoc.readyState === 'complete' || iframeDoc.readyState === 'uninitialized' || iframeDoc.readyState === 'interactive')) {
      iframeDoc.open();
      iframeDoc.write(iframeContents);
      iframeDoc.close();
      this.getFullHeight();
      Promise.all(Array.from(iframeDoc.images).filter(function (imageElement) {
        return !imageElement.complete;
      }).map(function (imageElement) {
        return new Promise(function (resolve) {
          imageElement.onload = imageElement.onerror = resolve;
        });
      })).then(function () {
        // re-layout full height after all images loaded in
        _this.getFullHeight();
      });
    } else if (iframeContents !== this.state.iframeContents) {
      this.iframeContentsTimeout = setTimeout(function () {
        _this.setState({
          iframeContents: iframeContents
        });

        _this.iframeContentsTimeout = null;
      }, 0);
    }
  },
  setContentRef: function setContentRef(node) {
    if (node && node.contentDocument) {
      this.iframeContentDocument = node.contentDocument;
    }
  },
  getScrollWrapper: function getScrollWrapper() {
    return this.iframeContentDocument && this.iframeContentDocument.body && this.iframeContentDocument.body.children[0];
  },
  getFullHeight: function getFullHeight() {
    var _this2 = this;

    var iframeInnerHeight = 0;
    var scrollWrapper = this.getScrollWrapper();

    if (scrollWrapper) {
      iframeInnerHeight = scrollWrapper.scrollHeight;
    }

    if (this.state.iframeInnerHeight !== iframeInnerHeight) {
      this.iframeInnerHeightTimeout = setTimeout(function () {
        _this2.setState({
          iframeInnerHeight: iframeInnerHeight
        });

        _this2.iframeInnerHeightTimeout = null;
      }, 0);
    } // If the iframe's height is 0 but there is content we may  need to rerender.


    if (iframeInnerHeight === 0 && (this.state.iframeContents || this.props.content)) {
      this.getFullHeightTimeout = setTimeout(this.getFullHeight, 500);
    }
  },
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        content = _this$props.content,
        onClick = _this$props.onClick,
        frameBorder = _this$props.frameBorder,
        sandbox = _this$props.sandbox,
        scrolling = _this$props.scrolling,
        style = _this$props.style;

    if (!content) {
      return /*#__PURE__*/_jsx("noscript", {});
    }

    return /*#__PURE__*/_jsx("iframe", {
      ref: this.setContentRef,
      style: Object.assign({}, style, {
        height: this.state.iframeInnerHeight
      }),
      onClick: onClick,
      className: className,
      frameBorder: frameBorder,
      scrolling: scrolling,
      sandbox: sandbox
    });
  }
});
export default SignatureIframe;