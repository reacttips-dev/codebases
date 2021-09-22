// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import zeroClipboard from 'bundles/zeroclipboard/coursera.zeroclipboard.v2-1-6';
import React from 'react';
import classnames from 'classnames';
import ZeroClipboardCopyLink from 'bundles/ui/components/CopyLink/ZeroClipboardCopyLink';
import 'css!./__styles__/CopyLink';

type Props = {
  shareLink: string;
  message: string;
};

class CopyLinkWithoutClipboard extends React.Component<Props> {
  render() {
    const { shareLink, message } = this.props;
    return (
      <div>
        <input type="text" className="c-link-input color-primary-text body-1-text" value={shareLink} readOnly />
        <div className="caption-text color-secondary-dark-text c-copy-message">{message}</div>
      </div>
    );
  }
}

type CopyLinkProps = {
  shareLink: string;
  message: string;
  className?: string;
};

type State = {
  isZeroClipboardEnabled: boolean;
};

class CopyLink extends React.Component<CopyLinkProps, State> {
  state: State = {
    isZeroClipboardEnabled: zeroClipboard.isEnabled(),
  };

  render() {
    const { className, shareLink, message } = this.props;
    const { isZeroClipboardEnabled } = this.state;
    const mainClasses = classnames(className, 'rc-CopyLink', 'vertical-box');

    /**
     * Copying to clipboard through zeroclipboard is not supported
     * by all browsers. For the ones that do not support it, show the text and
     * have the users manually copy it
     */
    return (
      <div className={mainClasses}>
        {isZeroClipboardEnabled ? (
          <ZeroClipboardCopyLink shareLink={shareLink} />
        ) : (
          <CopyLinkWithoutClipboard shareLink={shareLink} message={message} />
        )}
      </div>
    );
  }
}

export default CopyLink;
