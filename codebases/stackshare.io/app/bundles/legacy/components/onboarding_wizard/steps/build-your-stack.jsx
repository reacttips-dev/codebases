import PropTypes from 'prop-types';
import React, {Component} from 'react';
import glamorous from 'glamorous';
import {observer} from 'mobx-react';
import ServiceTile from '../../../../../shared/library/tiles/service.jsx';
import {TARMAC} from '../../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../../shared/style/typography';

import store from '../store/onboarding-wizard_store.js';
import FooterBar from '../components/footer-bar.jsx';
import ToolBuilder from '../../shared/tool_builder.jsx';
import * as C from '../../onboarding/constants';

const Services = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  '> *': {
    marginRight: 15,
    marginBottom: 15
  }
});

const TileLayout = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 57,
    alignItems: 'center',
    cursor: 'pointer',
    '& a': {
      cursor: 'pointer'
    }
  },
  ({isSelected}) => ({
    opacity: isSelected ? 0.2 : 1
  })
);

const ServiceName = glamorous.div({
  ...BASE_TEXT,
  fontSize: 10,
  color: TARMAC,
  marginTop: 6,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: 57
});

@observer
class BuildYourStack extends Component {
  state = {
    popularTools: []
  };

  getGithubNotification(toolsLength) {
    const {oauth} = store.instance;

    return (
      <span>
        Yay! We found{' '}
        <strong>
          {toolsLength} {toolsLength > 1 ? 'tools' : 'tool'}
        </strong>{' '}
        that you may be using based on your public {oauth.provider} profile.
      </span>
    );
  }

  componentDidMount() {
    const {selectedToolsLength, oauth, tracking} = store.instance;
    const {page_name, page_properties} = tracking;

    $.get('/api/v1/services/popular_services', response => {
      this.setState({popularTools: response});
    });

    if (selectedToolsLength) {
      store.instance.showNotification({
        type: 'info',
        message: this.getGithubNotification(selectedToolsLength),
        icon: oauth.icon
      });
    }

    trackEvent('Viewed onboarding.create_stack page', {
      contentGroupAuthenticationStatus: page_properties.contentGroupAuthenticationStatus,
      contentGroupPage: page_properties.contentGroupPage,
      name: page_name,
      path: window.location.pathname,
      title: document.title
    });
  }

  addTool(tool) {
    store.instance.addSelectedTool(tool, 'list');
  }

  removeTool(tool) {
    store.instance.removeSelectedTool(tool);
  }

  handleContinueClick() {
    trackEvent('onboarding.clicked_continue', {
      services: _.map(store.instance.selectedTools, 'slug'),
      feedWeeklySubscribed: store.instance.emailFeedWeekly
    });

    store.instance.submitFeedDigest().then(store.instance.saveSelectedTools);
  }

  getChildContext() {
    return {
      globalStore: store.instance
    };
  }

  renderSelectedTools = () => {
    const popularTools = this.state.popularTools;

    if (!popularTools.length) {
      return <img src={C.IMG_SPINNER} className="onboarding__tool-selection__loading" />;
    }

    return popularTools.map(tool => {
      const isSelected = store.instance.selectedTools.findIndex(t => t.id === tool.id) !== -1;
      const handleClick = isSelected ? () => this.removeTool(tool) : () => this.addTool(tool);

      return (
        <TileLayout key={`toolselection-tool-${tool.id}`} isSelected={isSelected}>
          <ServiceTile
            name={tool.name}
            imageUrl={tool.image_url}
            onClick={handleClick}
            preventDefault={true}
          />
          <ServiceName>{tool.name}</ServiceName>
        </TileLayout>
      );
    });
  };

  render() {
    const {selectedToolsLength, hasError, ajaxInProgress, clearSelectedTools} = store.instance;

    return (
      <div className="onboarding__step-content-wrap onboarding__build-your-stack">
        <div className="onboarding__step-content onboarding__build-your-stack__form">
          <div className="row onboarding-wizard__header">
            <div className="col-md-12">
              <h1 className="onboarding__step-heading">Add tools to your personal stack</h1>
              <p className="onboarding__step-subtext">
                Search for or select tools &amp; services you use in this stack
              </p>
              <ToolBuilder
                multiline={true}
                placeholder="Search & add tools"
                removeUnapproved={true}
                baseClassName="onboarding-tool-builder"
              />
              <div
                onClick={store.instance.toggleFeedDigest}
                className={
                  store.instance.emailFeedWeekly
                    ? 'onboarding__build-your-stack__subscription-checkbox checked'
                    : 'onboarding__build-your-stack__subscription-checkbox'
                }
                style={{marginLeft: 0}}
              >
                <span className="form-note">Send me weekly updates on these tools</span>
              </div>
            </div>
          </div>
          <div className="row onboarding-wizard__content">
            <div className="col-md-12">
              <h3 className="onboarding__step-subheading">Popular Tools</h3>
              <div className="onboarding__build-your-stack__form__tools-container">
                <Services>{this.renderSelectedTools()}</Services>
              </div>
            </div>
          </div>
        </div>
        <FooterBar
          onContinueClick={this.handleContinueClick}
          disableButton={!selectedToolsLength || hasError}
          ajaxInProgress={ajaxInProgress}
          altLink="Clear tools"
          onAltLinkClick={clearSelectedTools}
        />
      </div>
    );
  }
}

BuildYourStack.childContextTypes = {
  globalStore: PropTypes.object
};

BuildYourStack.propTypes = {};

export default BuildYourStack;
