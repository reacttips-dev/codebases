import React, {Component} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import MarkdownIcon from './icons/markdown.svg';
import {CONCRETE} from '../../../../shared/style/colors';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {FEED_CLICK_MARKDOWN_HELP} from '../../constants/analytics';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';

const Container = glamorous.div({
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'absolute',
  bottom: 4,
  right: 0
});

const MarkdownPanel = glamorous.a({
  fontStyle: 'italic',
  padding: '20px 0 0 0',
  cursor: 'pointer',
  color: CONCRETE,
  display: 'flex',
  justifyItems: 'center'
});

const StyledMarkdownIcon = glamorous(MarkdownIcon)({
  width: 35,
  height: 17,
  fill: CONCRETE,
  stroke: CONCRETE
});

class MarkdownHelp extends Component {
  static propTypes = {
    sendAnalyticsEvent: PropTypes.func,
    currentUser: PropTypes.object
  };

  onMarkdownHelpClick = () => {
    const userDetails = this.props.currentUser;
    this.props.sendAnalyticsEvent(FEED_CLICK_MARKDOWN_HELP, {
      userDetails
    });
  };

  render() {
    return (
      <Container>
        <MarkdownPanel
          href="/markdown-help"
          target="_blank"
          rel="noreferrer nofollow"
          onClick={this.onMarkdownHelpClick}
          title="Supported Markdown"
        >
          <span>Markdown Supported</span> <StyledMarkdownIcon />
        </MarkdownPanel>
      </Container>
    );
  }
}

export default withSendAnalyticsEvent(withCurrentUser(MarkdownHelp));
