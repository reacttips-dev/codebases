import React, { Component } from 'react';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { assignKey } from 'helpers/serverRenderingUtils';
import { TwitterIcon } from '../TwitterIcon';
import OutboundLink from '../OutboundLink';
import styles, {
  shareCenter,
  closeButton,
  shareHeader,
  shareTitle,
} from './styles.sass';
class ShareCenter extends Component {
  constructor(props, context) {
    super(props, context);
    this.buildHandleCopyText = this.buildHandleCopyText.bind(this);
    this.buildHandleShareAction = this.buildHandleShareAction.bind(this);
  }

  componentDidMount() {
    const { onHide } = this.props;
    assignKey('escape', onHide);
  }

  componentWillUnmount() {
    const { onHide } = this.props;
    assignKey.unbind('space', onHide);
  }

  buildHandleCopyText(type) {
    const { onCopyShareUrl } = this.props;
    return function handleCopyText() {
      return onCopyShareUrl(type);
    };
  }

  buildHandleShareAction(type) {
    const { onShareAction } = this.props;
    return function handleShareAction() {
      return onShareAction(type);
    };
  }

  render() {
    const {
      className,
      onHide,
      stationName,
      shareUrl,
      shareEmbedHtml,
      prompt = 'Share this station',
      episodeName,
    } = this.props;
    return (
      <div className={`${shareCenter} ${className}`}>
        <Row className={`${shareHeader} text-center`}>
          <Col xs={6} className={shareTitle}>
            <h3>{prompt}</h3>
          </Col>
          <Col xs={6} className={styles.socialLinks}>
            <OutboundLink
              to={getTwitterLinkFromAudioAndStation(
                episodeName,
                stationName,
                shareUrl
              )}
              newWindow
              onClick={this.buildHandleShareAction('twitter')}
            >
              <TwitterIcon width={18} height={14} color="#ffffff" />
            </OutboundLink>
            <OutboundLink
              to={getFacebookLinkFromAudioAndStation(shareUrl)}
              newWindow
              onClick={this.buildHandleShareAction('facebook')}
            >
              <svg width="7px" height="14px" viewBox="107 0 16 29">
                <path
                  d="M117.594374,28.5915493 L117.594374,15.5495584 L121.976622,15.5495584 L122.632802,10.4668632 L117.594374,10.4668632 L117.594374,7.22188337 C117.594374,5.75032581 118.003439,4.74750788 120.115877,4.74750788 L122.81019,4.74633178 L122.81019,0.200328367 C122.344219,0.138387306 120.744847,2.13162821e-14 118.884102,2.13162821e-14 C114.999482,2.13162821e-14 112.339966,2.36865752 112.339966,6.71851424 L112.339966,10.4668632 L107.946468,10.4668632 L107.946468,15.5495584 L112.339966,15.5495584 L112.339966,28.5915493 L117.594374,28.5915493 L117.594374,28.5915493 Z"
                  id="Facebook-Logo---Bigger"
                  stroke="none"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                />
              </svg>
            </OutboundLink>
            <a
              href={getEmailLinkFromAudioAndStation(
                episodeName,
                stationName,
                shareUrl
              )}
              onClick={this.buildHandleShareAction('email link')}
            >
              <svg width="19px" height="14px" viewBox="197 0 46 29">
                <g
                  id="Email"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                  transform="translate(197.084081, 0.000000)"
                >
                  <g fill="#FFFFFF">
                    <polygon points="22.3615171 20.1132614 22.3615171 20.1137082 22.3610699 20.1132614 0 4.22797535 0 28.5915493 44.7221398 28.5915493 44.7221398 4.2284221" />
                    <polygon points="44.4971874 0 0.225399585 0 22.3610699 15.6793376" />
                  </g>
                </g>
              </svg>
            </a>
          </Col>
        </Row>
        <span className={closeButton} onClick={onHide}>
          <svg
            width="14px"
            height="16px"
            viewBox="1041 302 16 18"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              id="Cancel-Copy"
              opacity="0.810000002"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
              transform="translate(1043.000000, 305.000000)"
              strokeLinecap="square"
            >
              <g id="X" stroke="#FFFFFF" strokeWidth="3">
                <path
                  d="M11.7316821,11.8839935 L0.229321213,0.231533107"
                  id="Line-14"
                />
                <path
                  d="M11.7316821,0.0593262946 L0.229321213,11.7117867"
                  id="Line-15"
                />
              </g>
            </g>
          </svg>
        </span>
        <Form horizontal>
          <FormGroup controlId="formHorizontalURL">
            <Col componentClass={ControlLabel} xs={2}>
              URL
            </Col>
            <Col xs={10}>
              <FormControl
                type="text"
                value={shareUrl}
                readOnly
                inputRef={node => {
                  this.urlInput = node;
                }}
                onFocus={() => {
                  this.urlInput.select();
                }}
                onCopy={this.buildHandleCopyText('URL')}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmbedCode">
            <Col componentClass={ControlLabel} xs={2}>
              EMBED
            </Col>
            <Col xs={10}>
              <FormControl
                type="text"
                value={shareEmbedHtml}
                readOnly
                inputRef={node => {
                  this.embedCodeInput = node;
                }}
                onFocus={() => {
                  this.embedCodeInput.select();
                }}
                onCopy={this.buildHandleCopyText('Embed URL')}
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default ShareCenter;

function getTwitterLinkFromAudioAndStation(episodeName, stationName, shareUrl) {
  if (episodeName) {
    return `https://twitter.com/intent/tweet?text=Listen%20to%20"${encodeURIComponent(
      episodeName
    )}" by ${encodeURIComponent(stationName)} ⚓ ${shareUrl}`;
  }
  return `https://twitter.com/intent/tweet?text=Listen%20to%20${encodeURIComponent(
    stationName
  )} on ⚓ ${shareUrl}`;
}

function getFacebookLinkFromAudioAndStation(shareUrl) {
  return `${
    'https://www.facebook.com/dialog/share' +
    '?app_id=446611785530020' +
    '&href='
  }${shareUrl}&redirect_uri=${shareUrl}`;
}
function getEmailLinkFromAudioAndStation(episodeName, stationName, shareUrl) {
  if (episodeName) {
    return `mailto:?to=&body=Listen%20to%20"${encodeURIComponent(
      episodeName
    )}" by ${encodeURIComponent(stationName)} ${shareUrl}`;
  }
  return `mailto:?to=&body=Listen%20to%20${encodeURIComponent(
    stationName
  )} ${shareUrl}`;
}
