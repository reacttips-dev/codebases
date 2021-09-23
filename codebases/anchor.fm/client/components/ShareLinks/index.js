import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FadeAnimation from '../FadeAnimation';
import OutboundLink from '../OutboundLink';
import { FacebookIcon } from '../FacebookIcon';
import { TwitterIcon } from '../TwitterIcon';
import CopySVG from '../svgs/Copy';
import styles from './styles.sass';
import { copyTextToClipboard } from '../../utils';

class ShareLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedUrl: false,
    };
  }

  onCopyUrl = evt => {
    const { onClickShare } = this.props;
    copyTextToClipboard(this.props.url);
    this.setState({ copiedUrl: true });
    onClickShare('url');
  };

  finishCopyAnimation = () => {
    setTimeout(() => {
      this.setState({ copiedUrl: false });
    }, 300);
  };

  render() {
    const { text, url, onClickShare, screen } = this.props;
    return (
      <div>
        <Row>
          {/* TODO: BUTTON HANDLERS */}
          <Col
            xs={4}
            className={`${styles.shareButton} ${styles.facebookButton}`}
          >
            <OutboundLink
              onClick={() => {
                onClickShare('facebook');
              }}
              to={getFacebookLinkFromAudioAndStation(url)}
              newWindow
            >
              <FacebookIcon width={38} height={38} />
            </OutboundLink>
            <p>Facebook</p>
          </Col>
          <Col
            xs={4}
            className={`${styles.shareButton} ${styles.twitterButton}`}
          >
            <OutboundLink
              onClick={() => {
                onClickShare('twitter');
              }}
              to={getTwitterLinkFromAudioAndStation(url, text)}
              newWindow
            >
              <TwitterIcon width={47} height={38} />
            </OutboundLink>
            <p>Twitter</p>
          </Col>
          <Col xs={4} className={`${styles.shareButton} ${styles.copyButton}`}>
            <button
              onClick={() => {
                this.onCopyUrl();
              }}
            >
              <CopySVG color="#5F6369" />
            </button>
            <FadeAnimation
              appear
              in={this.state.copiedUrl}
              onEntered={this.finishCopyAnimation}
              unmountOnExit
              fadeOut
            >
              <p>Copied!</p>
            </FadeAnimation>
            {!this.state.copiedUrl && <p>Copy URL</p>}
          </Col>
          {/* Temporarily removed */}
          {/* <Col xs={3} className={styles.shareButton}>
          <button onClick={this.onVideoClick}>
            <VideoSVG size={35} />
          </button>
          <p>
            Make Video
          </p>
        </Col> */}
        </Row>
      </div>
    );
  }
}

function getTwitterLinkFromAudioAndStation(url, text) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )} ${url}`;
}

function getFacebookLinkFromAudioAndStation(url) {
  return `${'https://www.facebook.com/dialog/share' +
    '?app_id=446611785530020' +
    '&href='}${url}&redirect_uri=${url}`;
}

export default ShareLinks;
