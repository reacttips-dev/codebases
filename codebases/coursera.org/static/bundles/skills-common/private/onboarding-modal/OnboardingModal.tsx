import React, { FunctionComponent, PureComponent, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _t from 'i18n!nls/skills-common';

import { TrackedButton } from 'bundles/common/components/withSingleTracked';
import TrackedIntrinsicButton from 'bundles/page/components/TrackedButton';
import Retracked from 'js/lib/retracked';

import { PageGraphics } from './OnboardingModalPageGraphics';

import 'css!./__styles__/OnboardingModal';

// Revisit this if onboarding content gains additional interactive elements.
const FocusSelector = 'button, a';

type PanelProps = {
  children: ReactNode | ReactNode[];
};

type PageProps = {
  children: [ReactElement<PanelProps>, ReactElement<PanelProps>];
  isSplash?: boolean;
};

// Ergonomic components; OnboardingModal yanks the props to render itself.
export const LeftPanel: FunctionComponent<PanelProps> = () => null;
export const Page: FunctionComponent<PageProps> = () => null;
export const RightPanel: FunctionComponent<PanelProps> = () => null;
export const Splash: FunctionComponent<PageProps> = () => null;

Splash.defaultProps = { isSplash: true };

type PagerProps = {
  count: number;
  index: number;
  onPageClick: (slide: number) => void;
  trackingName: string;
};

const Pager: FunctionComponent<PagerProps> = ({ count, index, onPageClick, trackingName }) => {
  const pages = new Array(count - 1);

  for (let i = 0; i <= count - 1; i += 1) {
    const label = _t('Skip to slide #{number}', { number: i + 1 });
    pages[i] = (
      <TrackedIntrinsicButton
        key={i}
        className="OnboardingModal-Pager-Page"
        type="button"
        onClick={() => onPageClick(i)}
        aria-label={label}
        data-e2e={`page-${i + 1}`}
        trackingName={`${trackingName}_page_button`}
        data={{ page: i + 1 }}
      >
        <div
          role="presentation"
          className={index === i ? 'OnboardingModal-Pager-Circle active' : 'OnboardingModal-Pager-Circle'}
        />
      </TrackedIntrinsicButton>
    );
  }

  return <div className="OnboardingModal-Pager">{pages}</div>;
};

type ModalProps = {
  actionText: string;
  children: ReactElement<PageProps> | ReactElement<PageProps>[];
  onActionClick: () => void;
  onDismissClick: () => void;
  titleText: string;
  trackingName: string;

  modalClassName?: string;
  isResponsive?: boolean;
  showBackButton?: boolean;
  secondaryActionText?: string;
  onSecondaryActionClick?: () => void;
};

type ModelState = {
  index: number;
};

export class Modal extends PureComponent<ModalProps, ModelState> {
  state = { index: 0 };

  static contextTypes = {
    _eventData: PropTypes.object.isRequired,
  };

  hasSplash() {
    return (
      // Casting child as any is necessary beacause typescript doesn't think that child has a 'props' property (which it should have, it's part of the ReactElement def)
      React.Children.toArray(this.props.children).some((child: any) => child.props && child.props.isSplash) &&
      React.Children.count(this.props.children) > 1
    );
  }

  getPageIndex() {
    return this.hasSplash() ? this.state.index - 1 : this.state.index;
  }

  getPageCount() {
    const count = React.Children.count(this.props.children);
    return this.hasSplash() ? count - 1 : count;
  }

  setPageIndex(pageIndex: number) {
    const count = React.Children.count(this.props.children);
    let clampedIndex = Math.max(this.hasSplash() ? 1 : 0, pageIndex);
    clampedIndex = Math.min(count - 1, clampedIndex);

    this.setState({
      index: clampedIndex,
    });
  }

  onSplash() {
    return this.hasSplash() && this.getPageIndex() < 0;
  }

  componentDidMount() {
    Retracked.trackComponent(this.context._eventData, { page: this.state.index }, this.props.trackingName, 'mount');
    document.body.classList.add('OnboardingModal-Open');
    document.addEventListener('keydown', this._handleA11yKeyDown, false);
    this._documentActiveElement = document.activeElement as HTMLElement;
    this._focusFirstElement();
  }

  componentWillUnmount() {
    Retracked.trackComponent(this.context._eventData, { page: this.state.index }, this.props.trackingName, 'unmount');
    document.body.classList.remove('OnboardingModal-Open');
    document.removeEventListener('keydown', this._handleA11yKeyDown, false);
    this._documentActiveElement?.focus();
  }

  _documentActiveElement: HTMLElement | null = null;

  _modalRef: HTMLElement | null = null;

  _handleModalRef = (modal: HTMLElement | null) => {
    this._modalRef = modal;
  };

  _handleShimClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      event.stopPropagation();
      Retracked.trackComponent(
        this.context._eventData,
        { page: this.state.index },
        `${this.props.trackingName}_dismiss_button`,
        'click_shim'
      );
      this._handleDismissA11y();
    }
  };

  _handleA11yKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Escape' || event.keyCode === 27 /* IE */) {
      Retracked.trackComponent(
        this.context._eventData,
        { page: this.state.index },
        `${this.props.trackingName}_dismiss_button`,
        'a11y'
      );
      this._handleDismissA11y();
    }
    if (event.code === 'ArrowLeft' || event.keyCode === 37 /* IE */) {
      Retracked.trackComponent(
        this.context._eventData,
        { page: this.state.index },
        `${this.props.trackingName}_next_button`,
        'a11y'
      );
      this._handlePrevClick();
    }
    if (event.code === 'ArrowRight' || event.keyCode === 39 /* IE */) {
      Retracked.trackComponent(
        this.context._eventData,
        { page: this.state.index },
        `${this.props.trackingName}_prev_button`,
        'a11y'
      );
      this._handleNextClick();
    }
  };

  _handleDismissA11y() {
    const { onDismissClick } = this.props;
    if (!this.onSplash()) {
      onDismissClick();
    }
  }

  _handleNextClick = () => {
    this.setPageIndex(this.state.index + 1);
  };

  _handlePrevClick = () => {
    this.setPageIndex(this.state.index - 1);
  };

  _handlePageClick = (index: number) => {
    this.setState({ index });
  };

  _focusFirstElement = () => {
    const focusElement = this._modalRef?.querySelector(FocusSelector) as HTMLElement;
    focusElement?.focus();
  };

  _focusLastElement = () => {
    const focusElements = this._modalRef?.querySelectorAll(FocusSelector);
    if (focusElements == null || focusElements.length <= 0) {
      return;
    }

    const focusElement = focusElements[focusElements.length - 1] as HTMLElement;
    focusElement.focus();
  };

  render() {
    const {
      actionText,
      children,
      onActionClick,
      onDismissClick,
      titleText,
      trackingName,
      secondaryActionText,
      onSecondaryActionClick,
    } = this.props;

    const countPagesIncludingSplash = React.Children.count(children);
    const indexPageIncludingSplash = Math.min(this.state.index, countPagesIncludingSplash - 1);
    const pages = React.Children.toArray(children);
    const page = pages[indexPageIncludingSplash] as React.ReactElement<PageProps>;

    // Destructuring the following component hierarchy:
    //
    // <Page>
    //   <LeftPanel>
    //     {left}
    //   </LeftPanel>
    //   <RightPanel>
    //     {right}
    //   </RightPanel>
    // <Page>

    const {
      props: {
        children: [
          {
            props: { children: left },
          },
          {
            props: { children: right },
          },
        ],
      },
    } = page;

    let dismissElement: ReactElement | undefined;
    if (!this.onSplash()) {
      dismissElement = (
        <TrackedButton
          rootClassName="OnboardingModal-Dismiss"
          type="noStyle"
          size="md"
          label={_t('Dismiss')}
          onClick={onDismissClick}
          htmlAttributes={{ 'data-e2e': 'dismiss' }}
          trackingName={`${this.props.trackingName}_dismiss_button`}
          trackingData={{ fromPage: indexPageIncludingSplash }}
        />
      );
    }

    let pagerElement: ReactElement | undefined;

    if (!this.onSplash() && this.getPageCount() > 1) {
      pagerElement = (
        <Pager
          count={this.getPageCount()}
          index={this.getPageIndex()}
          onPageClick={(newIndex) => this.setPageIndex(newIndex + (this.hasSplash() ? 1 : 0))}
          trackingName={trackingName}
        />
      );
    }

    const secondaryActionElement = (
      <TrackedButton
        rootClassName="OnboardingModal-SecondaryAction"
        type="noStyle"
        size="md"
        label={secondaryActionText}
        onClick={onSecondaryActionClick}
        htmlAttributes={{ 'data-e2e': 'onboarding-modal-secondary-action' }}
        trackingName={`${trackingName}_alt_button`}
        trackingData={{ page: indexPageIncludingSplash + 1 }}
      />
    );

    let actionElement: ReactElement;
    const lastPage = !(indexPageIncludingSplash < countPagesIncludingSplash - 1);
    if (!lastPage) {
      actionElement = (
        <TrackedButton
          rootClassName="OnboardingModal-Action"
          type="noStyle"
          size="md"
          label={_t('Next')}
          onClick={this._handleNextClick}
          htmlAttributes={{ 'data-e2e': 'next' }}
          trackingName={`${trackingName}_next_button`}
          trackingData={{ page: indexPageIncludingSplash + 1 }}
        />
      );
    } else {
      actionElement = (
        <TrackedButton
          rootClassName="OnboardingModal-Action"
          type="noStyle"
          size="md"
          label={actionText}
          onClick={onActionClick}
          htmlAttributes={{ 'data-e2e': 'action' }}
          trackingName={`${trackingName}_action_button`}
          trackingData={{ page: indexPageIncludingSplash + 1 }}
        />
      );
    }

    let goBackElement: ReactElement | undefined;
    if (!!this.props.showBackButton && this.getPageIndex() > 0) {
      goBackElement = (
        <TrackedButton
          rootClassName="OnboardingModal-Action OnboardingModal-Action--prev"
          type="noStyle"
          size="md"
          label={_t('Back')}
          onClick={this._handlePrevClick}
          htmlAttributes={{ 'data-e2e': 'prev' }}
          trackingName={`${trackingName}_prev_button`}
          trackingData={{ page: indexPageIncludingSplash - 1 }}
        />
      );
    }

    const pageGraphics = PageGraphics[indexPageIncludingSplash % PageGraphics.length];

    return (
      <div
        className="OnboardingModal-Shim"
        role="presentation"
        onClick={this._handleShimClick}
        onKeyPress={undefined /* attached to document */}
      >
        {/* focus trap element */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div role="presentation" tabIndex={0} onFocus={this._focusLastElement} />
        <div
          className={classNames(['OnboardingModal', this.props.modalClassName], {
            'OnboardingModal--responsive': this.props.isResponsive,
          })}
          role="dialog"
          aria-label={titleText}
          aria-modal="true"
          ref={this._handleModalRef}
        >
          <div className="OnboardingModal-LeftPanel">
            {pageGraphics}
            {pagerElement}
            {left}
            <div className="OnboardingModal-LeftPanel-ButtonContainer">
              {goBackElement}
              {actionElement}
              {lastPage &&
                secondaryActionText !== undefined &&
                onSecondaryActionClick !== undefined &&
                secondaryActionElement}
            </div>
          </div>
          <div className="OnboardingModal-RightPanel">
            {dismissElement}
            {right}
          </div>
        </div>
        {/* focus trap element */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div role="presentation" tabIndex={0} onFocus={this._focusFirstElement} />
      </div>
    );
  }
}
