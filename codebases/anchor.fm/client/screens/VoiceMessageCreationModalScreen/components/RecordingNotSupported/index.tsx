import classnames from 'classnames';
import React from 'react';
import trackEvent from '../../../../modules/analytics/trackEvent';
import { Browser } from '../../../../modules/Browser';
import { Icon } from '../../../../shared/Icon';
import Pressable from '../../../../shared/Pressable';
import { Statesman } from '../../../../shared/Statesman';
import { copyTextToClipboard } from '../../../../utils';

const styles = require('../RecordScene.sass');

interface RecordingNotSupportedProps {
  headingText: string;
  bodyText: string;
  onDidPressCopyLink: any;
  link: string;
  onComponentDidMount: any;
}

class RecordingNotSupported extends React.Component<
  RecordingNotSupportedProps,
  any
> {
  private container = React.createRef<HTMLDivElement>();
  public componentDidMount() {
    this.props.onComponentDidMount();
  }

  public render() {
    const { headingText, bodyText, onDidPressCopyLink, link } = this.props;
    const node = this.container.current!;
    return (
      <div className={styles.disabledRecording} ref={this.container}>
        <div className={styles.headingContainer}>
          <h6 className={styles.heading}>{headingText}</h6>
          <span className={styles.copy}>{bodyText}</span>
        </div>
        <ul className={styles.bullets}>
          <li className={styles.bullet}>
            <Statesman initialState={{ isShowingCopyConfirmation: false }}>
              {({ isShowingCopyConfirmation }, setState) => {
                const hideCopyConfirmation = () =>
                  setState(() => ({
                    isShowingCopyConfirmation: false,
                  }));
                const showCopyConfirmation = () =>
                  setState(() => ({
                    isShowingCopyConfirmation: true,
                  }));
                return (
                  <Pressable
                    onPress={() => {
                      copyTextToClipboard(link);
                      onDidPressCopyLink();
                      showCopyConfirmation();
                      setTimeout(() => {
                        hideCopyConfirmation();
                      }, 2000);
                    }}
                  >
                    {({ isPressed }) => (
                      <React.Fragment>
                        <span className={styles.circle}>
                          <strong className={styles.numeral}>1</strong>
                        </span>
                        <span
                          className={classnames(styles.bulletCopy, styles.bold)}
                        >
                          {isShowingCopyConfirmation
                            ? 'Copied!'
                            : 'Tap here to copy link'}
                          <span className={styles.icon}>
                            <Icon type="link" />
                          </span>
                        </span>
                      </React.Fragment>
                    )}
                  </Pressable>
                );
              }}
            </Statesman>
          </li>
          <li className={styles.bullet}>
            <span className={styles.circle}>
              <strong className={styles.numeral}>2</strong>
            </span>
            <span className={styles.bulletCopy}>Open Safari</span>
          </li>
          <li className={styles.bullet}>
            <span className={styles.circle}>
              <strong className={styles.numeral}>3</strong>
            </span>
            <span className={styles.bulletCopy}>Paste Link</span>
          </li>
        </ul>
        <div className={styles.tapSafariContainer}>
          <p className={styles.tapSafariCopy}>
            (Or, if you see a Safari button here, just tap that instead!)
          </p>
          <div className={styles.arrowContainer}>
            <Icon type="SafariArrow" />
          </div>
        </div>
      </div>
    );
  }
}

export default RecordingNotSupported;
