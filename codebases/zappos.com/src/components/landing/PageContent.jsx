import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { onEvent } from 'helpers/EventHelpers';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import HtmlToReact from 'components/common/HtmlToReact';
import { setupLandingEventWatcher } from 'helpers/LandingPageUtils';
import { evPageContentClick, evPageContentImpression } from 'events/symphony';
import { TRIM_BR_TAGS } from 'common/regex';

import css from 'styles/components/landing/pageContent.scss';

export class PageContent extends Component {
  constructor(props) {
    super(props);
    this.onResize = debounce(this.onResize.bind(this), 100);
    this.content = createRef();
  }

  state = {
    isExpanded: false,
    isMoreButtonVisible: false
  };

  componentDidMount() {
    const { slotDetails, slotIndex, slotName } = this.props;
    onEvent(window, 'click', this.onClick, null, this);
    onEvent(window, 'resize', this.onResize, null, this);
    this.onResize();
    setupLandingEventWatcher(this);
    track(() => ([evPageContentImpression, {
      slotDetails, slotIndex, slotName,
      content: this.content?.current?.innerText
    } ]));
  }

  onClick = e => {
    const { slotDetails, slotIndex, slotName } = this.props;
    const { content: { current, current: { innerText: content } = {} } } = this;
    const { target } = e;
    if (current.contains(target) && target.tagName === 'A') {
      track(() => ([evPageContentClick, {
        slotDetails, slotIndex, slotName, content,
        linkUrl: target.href,
        linkText: target.innerText
      } ]));
    }
  };

  onResize = () => {
    const { textDiv } = this;
    if (textDiv) {
      if (textDiv.scrollHeight > parseInt(window.getComputedStyle(textDiv).maxHeight, 10)) {
        this.setState({ isMoreButtonVisible: true });
      } else {
        this.setState({ isMoreButtonVisible: false });
      }
    }
  };

  makeAbout = (aboutText, testId) => {
    const { isExpanded } = this.state;
    return aboutText && <div className={cn(css.about, { [css.expanded]: isExpanded })} ref={this.content}>
      {this.makeText(aboutText, testId)}
      {this.makeButton()}
    </div>;
  };

  makeButton = () => {
    const { testId } = this.context;
    const { isExpanded, isMoreButtonVisible } = this.state;
    if (isMoreButtonVisible) {
      return (
        <button
          type="button"
          className={css.moreLess}
          onClick={this.moreLess}
          data-test-id={testId('readMoreLess')}>
          Read {isExpanded ? 'Less' : 'More'}
        </button>
      );
    }
  };

  makeDate = date => date && <p className={css.date}>{date}</p>;

  makeHeading = (heading, headerImageUrl) => {
    if (heading || headerImageUrl) {
      return headerImageUrl ? <img src={headerImageUrl} alt={`${heading} Logo`} /> : <h2>{heading}</h2>;
    }
  };

  makeSource = source => source && <p className={css.source}>{source}</p>;

  makeText = (aboutText, testId) => (
    <HtmlToReact ref={ el => this.textDiv = el } className={css.aboutTxt} data-test-id={testId('aboutBrandBody')}>
      {aboutText.replace(TRIM_BR_TAGS, '')}
    </HtmlToReact>
  );

  makeTitle = title => title && <h4 className={css.title}>{title}</h4>;

  moreLess = e => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
    e.target.blur();
  };

  render() {
    const { slotDetails, slotName, parsedBody: paramParsedBody, additionalClassName, containerDataId } = this.props;
    if (slotDetails.componentName === 'genericBrandAbout') {
      const { about, monetateId } = slotDetails;
      if (!about) {
        return null;
      }
      const { aboutText, headerImageUrl, name } = about;
      const { testId } = this.context;
      return (
        <div className={css.brandAbout} data-slot-id={slotName} data-monetate-id={monetateId}>
          <div className={css.brand} data-test-id={testId('aboutBrandHeader')}>
            {this.makeHeading(name, headerImageUrl)}
          </div>
          {this.makeAbout(aboutText, testId)}
        </div>
      );
    }

    const { pageContent: { body: slotBody, title, heading, source, date, style } = {}, monetateId } = slotDetails;
    return (
      <div
        data-pagecontent-id={containerDataId}
        className={
          cn(css.wrap, { // always include wrap
            [css.wrapAgreement]: !title && style === 'plain', // add extra css if true
            [css.mBlogContent]: style === 'melody-blog',
            [additionalClassName]: !!additionalClassName
          })
        }
        data-slot-id={slotName}
        data-monetate-id={monetateId}>
        {this.makeTitle(title)}
        {this.makeHeading(heading)}
        {this.makeSource(source)}
        {this.makeDate(date)}
        <HtmlToReact className={css.content} ref={this.content}>
          {paramParsedBody || slotBody}
        </HtmlToReact>
      </div>
    );
  }
}

PageContent.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('PageContent', PageContent);
