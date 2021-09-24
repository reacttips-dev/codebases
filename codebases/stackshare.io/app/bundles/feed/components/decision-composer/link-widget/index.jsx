import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Chip from '../chip';
import {withSendAnalyticsEvent} from '../../../../../shared/enhancers/analytics-enhancer';
import {
  FEED_CLICK_COMPOSER_ADD_LINK,
  FEED_FIRST_CHANGE_COMPOSER_ADD_LINK
} from '../../../constants/analytics';
import LinkIcon from '../icons/link-icon.svg';
import {GUNSMOKE} from '../../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../../shared/style/typography';

const Container = glamorous.div({
  position: 'relative',
  flex: 1
});

const InputField = glamorous.input({
  ...BASE_TEXT,
  border: 'none',
  outline: 'none',
  width: '100%',
  '&::placeholder': {
    color: GUNSMOKE
  }
});

export class LinkWidget extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    linkUrl: PropTypes.string,
    sendAnalyticsEvent: PropTypes.func
  };

  static defaultProps = {
    linkUrl: ''
  };

  state = {
    changeEventFired: false
  };

  inputField = null;
  assignInputField = el => (this.inputField = el);

  handleDelete = () => {
    this.props.onChange('');
    this.inputField.focus();
  };

  handleClick = () => {
    this.inputField.focus();
    this.props.sendAnalyticsEvent(FEED_CLICK_COMPOSER_ADD_LINK);
  };

  handleChange = () => {
    const {changeEventFired} = this.state;
    this.props.onChange(this.inputField.value);
    if (!changeEventFired) {
      this.props.sendAnalyticsEvent(FEED_FIRST_CHANGE_COMPOSER_ADD_LINK);
      this.setState({changeEventFired: true});
    }
  };

  render() {
    return (
      <Container>
        <Chip
          icon={<LinkIcon />}
          label={
            <InputField
              innerRef={this.assignInputField}
              type="text"
              placeholder="Link to your blog post or similar"
              onChange={this.handleChange}
              value={this.props.linkUrl}
            />
          }
          onClick={this.handleClick}
          onDelete={this.props.linkUrl && this.props.linkUrl.length > 0 ? this.handleDelete : null}
        />
      </Container>
    );
  }
}

export default withSendAnalyticsEvent(LinkWidget);
