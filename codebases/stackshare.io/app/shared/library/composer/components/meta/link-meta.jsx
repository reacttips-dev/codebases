import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Meta from './meta';
import {withSendAnalyticsEvent} from '../../../../enhancers/analytics-enhancer';
import {
  COMPOSER_CLICK_ADD_LINK,
  COMPOSER_FIRST_CHANGE_ADD_LINK
} from '../../../../constants/analytics';
import LinkIcon from '../../../icons/chips/link.svg';
import {GUNSMOKE} from '../../../../style/colors';
import {BASE_TEXT} from '../../../../style/typography';

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

export class LinkMeta extends Component {
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

  inputField = createRef();

  handleDelete = () => {
    this.props.onChange('');
    this.inputField.current.focus();
  };

  handleClick = () => {
    this.inputField.current.focus();
    this.props.sendAnalyticsEvent(COMPOSER_CLICK_ADD_LINK);
  };

  handleChange = () => {
    const {changeEventFired} = this.state;
    this.props.onChange(this.inputField.current.value);
    if (!changeEventFired) {
      this.props.sendAnalyticsEvent(COMPOSER_FIRST_CHANGE_ADD_LINK);
      this.setState({changeEventFired: true});
    }
  };

  render() {
    return (
      <Container>
        <Meta
          icon={<LinkIcon />}
          label={
            <InputField
              innerRef={this.inputField}
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

export default withSendAnalyticsEvent(LinkMeta);
