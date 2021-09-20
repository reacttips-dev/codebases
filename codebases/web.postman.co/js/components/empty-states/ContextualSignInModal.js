import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from '@postman/aether';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from '../base/Carousel';
import { Button } from '../base/Buttons';
import LeftArrowIcon from '../base/Icons/LeftArrowIcon';

export default class ContextualSignInModal extends Component {
  constructor (props) {
    super(props);
    this.state = { activeIndex: 0 };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleLearnMore = this.handleLearnMore.bind(this);
  }

  onExiting () {
    this.animating = true;
  }

  onExited () {
    this.animating = false;
  }

  next () {
    if (this.animating) {
      return;
    }

    const nextIndex = this.state.activeIndex === this.props.carouselData.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous () {
    if (this.animating) {
      return;
    }

    const nextIndex = this.state.activeIndex === 0 ? this.props.carouselData.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex (newIndex) {
    if (this.animating) {
      return;
    }

    this.setState({ activeIndex: newIndex });
  }

  handleClose () {
    this.props.onClose && this.props.onClose();
  }

  handleBack () {
    this.props.onBack && this.props.onBack();
  }

  handleCreateAccount () {
    this.props.onCreateAccount && this.props.onCreateAccount();
  }

  handleSignIn () {
    this.props.onSignIn && this.props.onSignIn();
  }

  handleLearnMore () {
    this.props.onLearnMore && this.props.onLearnMore();
  }

  getLeftSectionImageClassnames () {
    return classnames({
      'contextual-sign-in-modal__left-section--icon': true,
      [`contextual-sign-in-modal__left-section--${this.props.type}-icon`]: true
    });
  }

  getImageClassName (imageName) {
    return `contextual-sign-in-modal--${this.props.type}-${imageName}`;
  }

  getCarouselClasses () {
    return classnames({
      'contextual-sign-in-modal__right-section--carousel': true,
      'is-small': !this.props.hasLargeContent
    });
  }

  getCloseIconClasses () {
    return classnames({
      'contextual-sign-in-modal__right-section--close-icon': true,
      'is-enabled': this.props.isCloseEnabled
    });
  }

  render () {
    const { activeIndex } = this.state;

    const slides = this.props.carouselData.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.imageName}
        >
          <div className={this.getImageClassName(item.imageName)} />
          <CarouselCaption captionText={item.caption} />
        </CarouselItem>
      );
    });

    return (
      <div className='contextual-sign-in-modal'>
        {/* Left Section */}
        <section className='contextual-sign-in-modal__left-section'>
          {
            this.props.isBackEnabled &&
              <div className='contextual-sign-in-modal__left-section--back-icon'>
                <LeftArrowIcon onClick={this.handleBack} />
              </div>
          }
          <div className={this.getLeftSectionImageClassnames()} />
          <div className='contextual-sign-in-modal__left-section--title'>
            Create an account to continue
          </div>
          <div className='contextual-sign-in-modal__left-section--subtitle'>
            {this.props.subtitle}
          </div>
          <Button
            className='contextual-sign-in-modal__left-section--create-btn'
            type='primary'
            onClick={this.handleCreateAccount}
          >
            Create a free account
          </Button>
          <div className='contextual-sign-in-modal__separator-block'>
            <span className='contextual-sign-in-modal__separator-block--separator' />
            <span className='contextual-sign-in-modal__separator-block--separator-text'>OR</span>
            <span className='contextual-sign-in-modal__separator-block--separator' />
          </div>
          <Button
            type='text'
            onClick={this.handleSignIn}
          >
            Sign In
          </Button>
        </section>
        {/* Right Section */}
        <section className='contextual-sign-in-modal__right-section'>
          <Button
            type='tertiary'
            onClick={this.handleClose}
            className={this.getCloseIconClasses()}
          >
            <Icon name='icon-action-close-stroke' />
          </Button>
          <div className='contextual-sign-in-modal__right-section--title'>
            {this.props.carouselTitle}
          </div>
          <div className={this.getCarouselClasses()}>
            <Carousel
              activeIndex={activeIndex}
              next={this.next}
              previous={this.previous}
              interval={false}
            >
              <CarouselControl
                direction='prev'
                onClickHandler={this.previous}
              />
              {slides}
              <CarouselControl
                direction='next'
                onClickHandler={this.next}
              />
              <CarouselIndicators
                items={this.props.carouselData}
                activeIndex={activeIndex}
                onClickHandler={this.goToIndex}
              />
            </Carousel>
          </div>
          <Button
            className='contextual-sign-in-modal__right-section--learn-more'
            onClick={this.handleLearnMore}
            type='secondary'
          >
            {this.props.learnMoreText}
          </Button>
        </section>
      </div>
    );
  }
}

ContextualSignInModal.propTypes = {
  type: PropTypes.oneOf(['invite', 'mock', 'monitor', 'documentation']),
  subtitle: PropTypes.string,
  carouselTitle: PropTypes.string,
  carouselData: PropTypes.array.isRequired,
  learnMoreText: PropTypes.string,
  hasLargeContent: PropTypes.bool,
  isBackEnabled: PropTypes.bool,
  isCloseEnabled: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onLearnMore: PropTypes.func
};

