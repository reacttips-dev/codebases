import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {ONBOARDING_BASE_PATH} from './constants.js';
import {observer} from 'mobx-react';

export default
@observer
class OnboardingStackScan extends Component {
  constructor(props) {
    super(props);
    this.progressNotesArray = [
      'URL looks good!',
      'Initializing import...',
      'Firing up analysis engine...',
      'Performing super sophisticated analysis...'
    ];
    this.state = {
      scanUrl: '',
      scanState: 0, // 0: pre-scan, 1: scanning, 2: done scanning
      urlTaken: false,
      takenUrlPath: '',
      timeouts: {
        importInterval: 0,
        importTimeout: 0
      },
      progressBarVerb: 'Scanning'
    };

    $(document).on('onboarding.clear-scanUrl', () => {
      this.setState({scanUrl: ''});
    });

    // event bindings
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.scanUrl = this.scanUrl.bind(this);
    this.serverImportTimeout = this.serverImportTimeout.bind(this);
  }

  componentDidMount() {
    $(document).trigger('onboarding.soft-reset');
    this.context.navStore.backRoute = undefined;
  }

  componentWillUnmount() {
    this.clearIntervals();
  }

  progressNotes() {
    return (
      <ul>
        {this.progressNotesArray.map((note, i) => {
          return <li key={`progress-note-${i}`}>{note}</li>;
        })}
      </ul>
    );
  }

  initiateImport() {
    this.context.globalStore.selectedTools = [];

    this.setState({
      scanState: 1
    });

    this.setState({
      timeouts: Object.assign(this.state.timeouts, {
        importInterval: setInterval(() => {
          this.checkServerImport();
        }, 2000),
        importTimeout: setTimeout(() => {
          this.serverImportTimeout();
        }, 30000)
      })
    });
  }

  serverImportTimeout() {
    this.resetScanState();
    this.setState({scanState: 0});
    if (this.context.globalStore.selectedTools.length === 0) {
      $(document).trigger(
        'errorMsg',
        "We can't find anything, type in another URL or click 'Skip'"
      );
      trackEvent('stack.create.scan.siteScan', {value: 'empty'});
    }
  }

  checkServerImport() {
    let component = this;

    $.get('/api/v1/analyze', {url: this.state.scanUrl}, response => {
      if (response instanceof Array && response.length === 0) {
        this.serverImportTimeout();
      } else if (response instanceof Array) {
        trackEvent('stack.create.scan.siteScan', {value: 'valid'});
        response = response
          .map(service => {
            return service.name;
          })
          .join(',');
        $.get(
          '/services/find_all_by_slug',
          {
            slugs: response,
            url: this.state.scanUrl
          },
          response => {
            for (let tool of response) component.context.globalStore.addSelectedTool(tool);
            component.finished();
            component.context.globalStore.scanned = true;

            let formattedUrl = this.state.scanUrl;
            if (!/^http:|^https:/.test(formattedUrl)) formattedUrl = `http://${formattedUrl}`;
            component.context.globalStore.stackInfo.website_url = formattedUrl;
            component.context.globalStore.newCompany.website_url = formattedUrl;
          }
        );
      }
    });
  }

  finished() {
    this.clearIntervals();
    this.setState({scanState: 2, progressBarVerb: 'Done!'});
  }

  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }
  onBlur() {
    this.checkUrl();
  }
  checkUrl(callback) {
    if (/github\.com\/.+/.test(this.state.scanUrl)) {
      callback && callback();
      return;
    }

    $.get('/stacks/url_exists', {url: this.state.scanUrl}, response => {
      if (response.claimed) {
        this.setState({urlTaken: true, takenUrlPath: response.path});
        trackEvent('stack.create.scan.siteScan', {value: 'claimed'});
      } else if (callback) {
        callback();
      }
    });
  }
  onContinue() {
    trackEvent('stack.create.scan.submit', {value: 'imported'});

    if (!this.context.routerProps.userId) {
      $(document).trigger('onboarding.sign-in');
      return;
    }

    browserHistory.push(`${ONBOARDING_BASE_PATH}/stack-type`);
  }
  onSkip() {
    trackEvent('stack.create.scan.submit', {value: 'skip'});

    if (!this.context.routerProps.userId) {
      $(document).trigger('onboarding.sign-in');
      return;
    }

    browserHistory.push(`${ONBOARDING_BASE_PATH}/stack-type`);
  }

  onKeyDown(event) {
    this.setState({urlTaken: false});
    if (event.key === 'Enter') this.checkUrl(this.scanUrl.bind(this));
  }

  clearIntervals() {
    clearInterval(this.state.timeouts.importInterval);
    clearTimeout(this.state.timeouts.importTimeout);
  }

  resetScanState() {
    this.clearIntervals();
    this.setState({progressBarVerb: 'Scanning'});
  }

  scanButtonClasses() {
    return `button-full ${this.state.scanState === 1 ? 'disabled' : ''}`;
  }

  scanUrl() {
    this.resetScanState();
    let component = this;
    let urlRegexp = new RegExp(
      /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,14}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/
    );
    if (this.state.scanUrl.match(urlRegexp)) {
      component.setState({scanState: 1});

      $.ajax({
        type: 'GET',
        url: `/api/v1/analyze?url=${component.state.scanUrl}`,
        contentType: 'appication/json',
        success() {
          component.initiateImport();
        }
      });
    } else {
      $(document).trigger('errorMsg', 'Url format is invalid.');
      component.setState({scanState: 0});
      trackEvent('stack.create.scan.siteScan', {value: 'invalid'});
    }
  }

  doneClass() {
    return this.state.scanState === 2 ? 'done' : '';
  }

  render() {
    return (
      <div className="onboarding__scan-stack">
        <h3>
          Scan Your Stack <span className="onboarding__scan-stack--optional">(optional)</span>
        </h3>
        <div>
          <div>
            Enter a URL for your company&apos;s<b> website, </b>or the URL for one of your
            <b> public GitHub repositories. </b>We&apos;ll guess your stack before you create your
            stack page.
          </div>
        </div>
        <div className="onboarding__scan-stack__container">
          <div className="onboarding__input-container">
            <input
              type="text"
              value={this.state.scanUrl}
              name="scanUrl"
              placeholder="https://yoursiteurl.com"
              onBlur={this.onBlur}
              onChange={this.onChange}
              onSubmit={this.scanUrl}
              onKeyPress={this.onKeyDown}
              onPaste={() => {
                trackEvent('stack.create.scan.scanUrl', {value: 'pasted'});
              }}
              pattern="https?://.+\..+"
              required
            />
            <button
              className={this.scanButtonClasses()}
              onClick={() => {
                this.checkUrl(this.scanUrl);
              }}
            >
              Scan
            </button>
            <button className="button-empty" onClick={this.onSkip}>
              Skip
            </button>
          </div>
          {this.state.urlTaken && (
            <div id="view-stackexist" className="onboarding__scan-stack__url-taken">
              This stack already exists.{' '}
              <a href={this.state.takenUrlPath}>Click here to view it.</a>
            </div>
          )}
          {this.state.scanState > 0 && (
            <div>
              <div id="view-stackprogress" className="onboarding__scan-stack__progress">
                <div className={this.doneClass()}>{this.state.progressBarVerb}</div>
              </div>
              <div className={`onboarding__scan-stack__status ${this.doneClass()}`}>
                {this.progressNotes()}
              </div>
            </div>
          )}
          {this.context.globalStore.selectedTools.length > 0 && this.state.scanState === 2 && (
            <div className="onboarding__scan-stack__tools">
              <h3>Tools we&apos;ve found</h3>
              {this.context.globalStore.selectedTools.map(tool => {
                return (
                  <div
                    key={tool.id}
                    className="onboarding__scan-stack__tool hint--top"
                    data-hint={tool.name}
                  >
                    <img src={tool.image_url} />
                  </div>
                );
              })}
              <div className="onboarding__scan-stack__continue">
                <button onClick={this.onContinue}>Edit & Save Your Stack</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

OnboardingStackScan.contextTypes = {
  globalStore: PropTypes.object,
  routerProps: PropTypes.object,
  navStore: PropTypes.object
};
