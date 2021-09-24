import React, {Component} from 'react';
import store from '../store/onboarding-wizard_store.js';
import FooterBar from '../components/footer-bar.jsx';

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  handleButtonClick = () => {
    trackEvent('onboarding.clicked_create_stack', {});
    store.instance.goToNextStep();
  };

  componentDidMount() {
    try {
      const lastPage = localStorage.getItem('Signin.v2.lastPage');
      if (lastPage) {
        localStorage.setItem('Onboarding.redirect', lastPage);
      }
    } catch {
      // nothing
    }

    const {page_name, page_properties, path, referrer, url} = store.instance.tracking;

    trackEvent('Viewed onboarding.intro Page', {
      contentGroupAuthenticationStatus: page_properties.contentGroupAuthenticationStatus,
      contentGroupPage: page_properties.contentGroupPage,
      name: page_name,
      path,
      referrer,
      url,
      title: document.title
    });
  }

  render() {
    return (
      <div className="onboarding_wizard--welcome">
        <div className="onboarding_wizard--welcome__content">
          <div className="container">
            <div className="row onboarding-wizard__header">
              <div className="col-md-12">
                <h1 className="heading">Welcome To StackShare</h1>
                <p className="subtext">Why share your stack?</p>
              </div>
            </div>
          </div>

          <div className="graphic-wrapper">
            <div className="container">
              <div className="row content-wrapper">
                <div className="col-md-4 col-sm-4 item">
                  <img src={store.instance.icons.resumeIconPath} />
                  <h2>
                    <b>Use your stack profile as your tech resume</b>
                  </h2>
                  <p>
                    Easily list out the technologies you know and share the link on your resume and
                    personal site
                  </p>
                </div>
                <div className="col-md-4 col-sm-4 item">
                  <img src={store.instance.icons.bullhornIconPath} />
                  <h2>
                    <b>Stay up to date with your favorite tools</b>
                  </h2>
                  <p>
                    Get a curated feed and alerts for all the latest updates for the technology you
                    care about
                  </p>
                </div>
                <div className="col-md-4 col-sm-4 item">
                  <img src={store.instance.icons.communityIconPath} />
                  <h2>
                    <b>Share & contribute to the community</b>
                  </h2>
                  <p>Help other engineers pick the right tools and learn from your experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterBar onContinueClick={this.handleButtonClick} centerContent={true} />
      </div>
    );
  }
}

export default Welcome;
