import ReactDOM from 'react-dom';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import zeroClipboard from 'bundles/zeroclipboard/coursera.zeroclipboard.v2-1-6';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'bundles/iconfont/Icon';
import _t from 'i18n!nls/ondemand';
import classnames from 'classnames';

class ZeroClipboardCopyLink extends React.Component {
  static propTypes = {
    shareLink: PropTypes.string.isRequired,
  };

  state = {
    isCopied: false,
    isZeroClipboardEnabled: zeroClipboard.isEnabled(),
  };

  componentDidMount() {
    if (this.state.isZeroClipboardEnabled) {
      zeroClipboard(ReactDOM.findDOMNode(this.refs.copyButton));
    }
  }

  copyLinkToClipboard = (e: $TSFixMe) => {
    this.setState({ isCopied: true });
    setTimeout(this.reset, 3000);
  };

  reset = () => {
    this.setState({ isCopied: false });
  };

  render() {
    const messageClasses = classnames('caption-text', 'color-secondary-text', 'clipboard-message', {
      'transition-in': this.state.isCopied,
    });

    const boxClasses = classnames('horizontal-box', 'box', {
      copied: this.state.isCopied,
    });

    const copyButton = (
      <button
        ref="copyButton"
        data-clipboard-target="link"
        onClick={this.copyLinkToClipboard}
        className="secondary copy"
      >
        {_t('Copy')}
      </button>
    );

    const checkMarkButton = (
      <button className="primary checkmark">
        <Icon name="check" />
      </button>
    );

    return (
      <div>
        <div className={boxClasses}>
          <div id="link" className="flex-1 link horizontal-box align-items-vertical-center bgcolor-white">
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'shareLink' does not exist on type 'Reado... Remove this comment to see the full error message */}
            {this.props.shareLink}
          </div>
          {/* empty paragraph tag to make sure that "Copy" is not appended when triple clicking */}
          <p />
          {this.state.isCopied ? checkMarkButton : copyButton}
        </div>
        {this.state.isCopied && <div className={messageClasses}>{_t('Copied to clipboard')}</div>}
      </div>
    );
  }
}

export default ZeroClipboardCopyLink;
