import 'modernizr';

import { CHECK_DONE, CHECK_NOT_STARTED, CHECK_STARTED } from './constants';

import IconUdacity from 'images/icons/udacity.svg';
import { IconWarning } from '@udacity/veritas-icons';
import Manager from 'components/notifications/manager';
import Player from '@udacity/ureact-player';
import React from 'react';
import ShowProperty from './show-property';
import Svg from 'react-inlinesvg';
import styles from './index.scss';

const { Modernizr } = window;

const PROXY_TEST_COOKIE_URL = `https://${CONFIG.workspacesProxyDomain}/spacegate/v1/test-cookie`;
const PROXY_TEST_WEBSOCKETS_URL = `wss://${CONFIG.workspacesProxyDomain}/spacegate/v1/test-ws/talk`;
const SOCKET_SEND_MESSAGE = 'PING';
const PROXY_TEST_COOKIE_VALUE = 'available';
const YOUTUBE_VIDEO_ID = 'F_3Wgxr_Alg'; // udacity video
const HTML5_VIDEO_TRANSCODINGS = {
  uri_720p_mp4:
    'https://video.udacity-data.com/topher/2019/April/5cc89c33_introduction-to-udacity-high-touch-v3/introduction-to-udacity-high-touch-v3.mp4',
};
const CHINA_CDN_ID = 'F_3Wgxr_Alg.mp4';

class CompatibilityChecker extends React.Component {
  constructor(props) {
    super(props);

    this.socket = null;

    this.state = {
      checkingBrowserFeatures: CHECK_NOT_STARTED,
      checkingThirdPartyCookies: CHECK_NOT_STARTED,
      checkingWebsocketsSupport: CHECK_NOT_STARTED,
      checkingVideoSupport: CHECK_NOT_STARTED,
      browserFeatures: false,
      thirdPartyCookies: false,
      websocketsSupport: false,
    };
  }

  async componentDidMount() {
    // hide the login notification alert
    Manager.setRead('login', true);

    await this._sleep(200);
    await this.testBrowserFeatures();
    await this._sleep(200);
    await this.canBrowserAccept3PCookies();
    await this._sleep(200);
    await this.canSpeakSockets();
    await this._sleep(200);
    this.canPlayVideos();
  }

  _sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  allChecksDone = () => {
    return (
      this.state.checkingBrowserFeatures === CHECK_DONE &&
      this.state.checkingThirdPartyCookies === CHECK_DONE &&
      this.state.checkingWebsocketsSupport === CHECK_DONE &&
      this.state.checkingVideoSupport === CHECK_DONE
    );
  };

  checksSuccessful = () => {
    return (
      this.state.browserFeatures &&
      this.state.thirdPartyCookies &&
      this.state.websocketsSupport
    );
  };

  testBrowserFeatures = async () => {
    this.setState({
      checkingBrowserFeatures: CHECK_STARTED,
    });

    await this._sleep(500);

    if (
      Modernizr.cookies &&
      Modernizr.websockets &&
      Modernizr.history &&
      Modernizr.cors &&
      Modernizr.localstorage &&
      Modernizr.json &&
      Modernizr.video &&
      Modernizr.es6object &&
      Modernizr.fetch
    ) {
      this.setState({
        checkingBrowserFeatures: CHECK_DONE,
        browserFeatures: true,
      });
    } else {
      this.setState({
        checkingBrowserFeatures: CHECK_DONE,
        browserFeatures: false,
      });
    }

    return Promise.resolve(true);
  };

  canBrowserAccept3PCookies = async () => {
    let response, data;

    this.setState({
      checkingThirdPartyCookies: CHECK_STARTED,
    });

    await this._sleep(500);

    try {
      response = await fetch(PROXY_TEST_COOKIE_URL, { credentials: 'include' });
      data = await response.json();
    } catch (error) {
      this.setState({
        checkingThirdPartyCookies: CHECK_DONE,
        thirdPartyCookies: false,
      });

      return Promise.resolve(true);
    }

    // was set previously
    if (data.cookie === PROXY_TEST_COOKIE_VALUE) {
      this.setState({
        checkingThirdPartyCookies: CHECK_DONE,
        thirdPartyCookies: true,
      });

      return Promise.resolve(true);
    }

    try {
      // cookie should be set by the request above
      response = await fetch(PROXY_TEST_COOKIE_URL, { credentials: 'include' });
      data = await response.json();
    } catch (error) {
      this.setState({
        checkingThirdPartyCookies: CHECK_DONE,
        thirdPartyCookies: false,
      });

      return Promise.resolve(true);
    }

    if (data.cookie === PROXY_TEST_COOKIE_VALUE) {
      this.setState({
        checkingThirdPartyCookies: CHECK_DONE,
        thirdPartyCookies: true,
      });
    } else {
      this.setState({
        checkingThirdPartyCookies: CHECK_DONE,
        thirdPartyCookies: false,
      });
    }

    return Promise.resolve(true);
  };

  _socketError = () => {
    this.setState({
      checkingWebsocketsSupport: CHECK_DONE,
      websocketsSupport: false,
    });
  };

  _socketOnOpen = () => {
    this.socket.send(SOCKET_SEND_MESSAGE);
  };

  _socketOnMessage = (evt) => {
    console.info('got socket response message: ', evt.data);

    this.setState({
      checkingWebsocketsSupport: CHECK_DONE,
      websocketsSupport: true,
    });
  };

  canSpeakSockets = async () => {
    this.setState({
      checkingWebsocketsSupport: CHECK_STARTED,
    });

    await this._sleep(500);

    try {
      this.socket = new WebSocket(PROXY_TEST_WEBSOCKETS_URL);
      this.socket.onerror = this._socketError;
      this.socket.onmessage = this._socketOnMessage;
      this.socket.onopen = this._socketOnOpen;
    } catch (error) {
      console.error('Failed to establish web socket');
      this.setState({
        checkingWebsocketsSupport: CHECK_DONE,
        websocketsSupport: false,
      });
    }
  };

  canPlayVideos = async () => {
    await this._sleep(500);

    this.setState({
      checkingVideoSupport: CHECK_STARTED,
    });

    return Promise.resolve(true);
  };

  renderBrowserCheck = () => {
    const { checkingBrowserFeatures, browserFeatures } = this.state;

    return (
      <ShowProperty
        checkingStatus={checkingBrowserFeatures}
        checkingTitle="Checking browser compatibility"
        checkedTitle="Browser"
        description="We test your browser to confirm support for the features that Classroom student experience needs to serve content."
        value={browserFeatures}
      />
    );
  };

  renderThirdPartyCookiesCheck = () => {
    const { checkingThirdPartyCookies, thirdPartyCookies } = this.state;

    if (checkingThirdPartyCookies === 0) {
      return;
    }

    return (
      <ShowProperty
        checkingStatus={checkingThirdPartyCookies}
        checkingTitle="Checking third-party cookie support"
        checkedTitle="Third-party Cookies"
        description="Third-party cookies must be enabled in your browser for us to effectively serve content from Udacity domains."
        value={thirdPartyCookies}
      />
    );
  };

  renderWebsocketsCheck = () => {
    const { checkingWebsocketsSupport, websocketsSupport } = this.state;

    if (checkingWebsocketsSupport === 0) {
      return;
    }

    return (
      <ShowProperty
        checkingStatus={checkingWebsocketsSupport}
        checkingTitle="Checking web sockets support"
        checkedTitle="Web Sockets"
        description="Your network must allow access to web sockets for the exercises included in the Nanodegree programs and courses."
        value={websocketsSupport}
      />
    );
  };

  renderVideoCheck = () => {
    const { checkingVideoSupport } = this.state;

    if (checkingVideoSupport === 0) {
      return;
    }

    return (
      <ShowProperty
        checkingStatus={CHECK_DONE}
        checkingTitle="Checking Video support"
        checkedTitle="Video"
        description="Please make sure that you are able to watch the following video. If the video doesn't play, please contact us."
        value={true}
      />
    );
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.logoContainer}>
            <Svg src={IconUdacity} className={styles.udacityLogo} />
            <span>UDACITY</span>
          </div>
        </div>
        <div className={styles.section}>
          <h1>System Compatibility Checker</h1>
        </div>
        <div className={styles.section}>
          To participate in a Udacity Nanodegree program, your browser and
          system must meet some minimum requirements. Some programs may have
          have additional requirements.
        </div>
        <div className={styles.section}>
          {this.allChecksDone() ? (
            this.checksSuccessful() ? (
              <h3 className={styles.success}>
                Everything looks good! You are good to go.
              </h3>
            ) : (
              <h3 className={styles.fail}>
                We found some issues. Please follow our recommendations below to
                address them.
              </h3>
            )
          ) : (
            <h3>Please wait as we check your system.</h3>
          )}
        </div>
        {this.renderBrowserCheck()}
        {this.renderThirdPartyCookiesCheck()}
        {this.renderWebsocketsCheck()}
        <div className={styles.ytProperty}>
          {this.renderVideoCheck()}
          {[CHECK_STARTED, CHECK_DONE].includes(
            this.state.checkingVideoSupport
          ) && (
            <div className={styles.videoEmbed}>
              <Player
                youtubeId={YOUTUBE_VIDEO_ID}
                isPlaying={false}
                chinaCdnId={CHINA_CDN_ID}
                isAlternativePlayer={true}
                transcodings={HTML5_VIDEO_TRANSCODINGS}
              />
            </div>
          )}
        </div>

        {this.allChecksDone() && !this.checksSuccessful() && (
          <div className={styles.recommendationsSection}>
            <h3 className={styles.suggestions}>
              <IconWarning size="md" />
              Recommendations
            </h3>
            <hr />
            <p>
              <strong>
                The following fixes are recommended to be able to successfully
                complete a Udacity program or course.
              </strong>
            </p>
            <br />
            {!this.state.browserFeatures && (
              <div className={styles.propertySection}>
                <span>
                  Please make sure that you are using one of the following
                  browsers &mdash; <b>Google Chrome</b> (version 56 and above),{' '}
                  <b>Mozilla Firefox</b>
                  (version 52 and above), <b>Apple Safari</b> (version 10 and
                  above), or <b>Microsoft Edge</b> (version 15 and above), or{' '}
                  <b>Opera</b> (version 43 and above). Internet Explorer or
                  lower versions of the browsers listed above are not supported.
                </span>
              </div>
            )}

            {!this.state.thirdPartyCookies && (
              <div className={styles.propertySection}>
                <span>
                  Please disable blocking of third-party cookies in your
                  browser. Udacity domains{' '}
                  <span className={styles.link}>*.udacity.com</span> and{' '}
                  <span className={styles.link}>
                    *.udacity-student-workspaces.com
                  </span>{' '}
                  need to set cookies to track student progress in our courses.
                </span>
              </div>
            )}

            {!this.state.websocketsSupport && (
              <div className={styles.propertySection}>
                <span>
                  Please ask your network administrator to enable web socket
                  traffic to{' '}
                  <span className={styles.link}>
                    *.udacity-student-workspaces.com
                  </span>
                  .
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default cssModule(CompatibilityChecker, styles);
