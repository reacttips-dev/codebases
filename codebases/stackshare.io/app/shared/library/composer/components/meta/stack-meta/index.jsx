import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import StackSearch from './search';
import Meta from '../meta';
import StackIcon from '../../../../icons/chips/stack.svg';
import {withSendAnalyticsEvent} from '../../../../../enhancers/analytics-enhancer';
import {COMPOSER_CHOOSE_STACK, COMPOSER_CLEAR_STACK} from '../../../../../constants/analytics';
import {stackLabel, stackImage, stackPresenter} from '../../../utils';
import {IMAGE_TYPE_USER} from '../../../constants';

const Container = glamorous.div({
  position: 'relative',
  flex: 1
});

const PersonalStackIcon = glamorous.img({
  borderRadius: '50%'
});

export class StackMeta extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    taggedStack: PropTypes.object,
    myStacks: PropTypes.array,
    disabled: PropTypes.bool,
    sendAnalyticsEvent: PropTypes.func
  };

  state = {
    active: false
  };

  container = createRef();

  toggleActive = () => {
    if (this.props.disabled) {
      return;
    }
    // if about to activate, add event listener so we can deactivate on document click
    if (!this.state.active) {
      document.addEventListener('click', this.handleBlur, {capture: true, once: true});
    }
    this.setState({active: !this.state.active});
  };

  handleBlur = event => {
    if (this.container.current && !this.container.current.contains(event.target)) {
      this.toggleActive();
    }
  };

  handleChange = stack => {
    if (this.props.disabled) {
      return;
    }
    this.setState({active: false});
    if (stack) {
      this.props.sendAnalyticsEvent(COMPOSER_CHOOSE_STACK, stackPresenter('taggedStack', stack));
    } else {
      this.props.sendAnalyticsEvent(
        COMPOSER_CLEAR_STACK,
        stackPresenter('taggedStack', this.props.taggedStack)
      );
    }
    this.props.onChange(stack);
  };

  render() {
    const {taggedStack, myStacks, disabled} = this.props;
    const {active} = this.state;
    return (
      <Container innerRef={this.container}>
        {taggedStack ? (
          <Meta
            icon={
              taggedStack.imageType === IMAGE_TYPE_USER ? (
                <PersonalStackIcon src={taggedStack.imageUrl} />
              ) : (
                taggedStack.imageUrl || stackImage(taggedStack.imageType)
              )
            }
            label={stackLabel({stack: taggedStack, bold: true})}
            onClick={this.toggleActive}
            onDelete={this.handleChange}
          />
        ) : (
          <Meta
            icon={<StackIcon />}
            label="Tag your stack"
            onClick={this.toggleActive}
            placeholder={true}
          />
        )}
        {active && !disabled && <StackSearch onChoose={this.handleChange} myStacks={myStacks} />}
      </Container>
    );
  }
}

export default withSendAnalyticsEvent(StackMeta);
