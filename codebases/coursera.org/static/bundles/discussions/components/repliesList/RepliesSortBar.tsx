import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import _t from 'i18n!nls/discussions';
import { answerSorts, naptimeForumTypes, gradedDiscussionPromptTypes } from 'bundles/discussions/constants';

import 'css!./__styles__/RepliesSortBar';

const { oldestSort, popularSort, newestSort } = answerSorts;
const { allPosts, mySubmissionsOnly } = gradedDiscussionPromptTypes;

const generateUrl = function (forumType: string, sort: string, type?: string) {
  if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    return window.location.pathname + '?sort=' + sort + '&page=1&type=' + type;
  } else {
    return window.location.pathname + '?sort=' + sort + '&page=1';
  }
};

const generateClassNames = (currentSort: string, sortType: string) => {
  return classNames('tab', {
    selected: currentSort === sortType,
  });
};

export const generateTabId = (sortType: string) => `reply-tab~${sortType}`;

type Props = {
  sort: string;
  forumType: string;
  forumTypeSetting: string;
};

class RepliesSortBar extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
  };

  tabRefs: Array<HTMLAnchorElement | null> = [];

  handleLinkNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { router } = this.context;

    event.preventDefault();

    const newLocation = (event.target as HTMLAnchorElement).href.replace(window.location.origin, '');
    router.push(newLocation);
  };

  // keyboard navigation and aria-properties taken from https://www.w3.org/TR/wai-aria-practices-1.2/examples/tabs/tabs-2/tabs.html
  handleTabKeyboardControls = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const currentIndex = this.tabRefs.indexOf(event.target as HTMLAnchorElement);

    if (currentIndex !== -1) {
      switch (event.key) {
        case 'ArrowRight': {
          event.preventDefault();
          const nextIndex = currentIndex === this.tabRefs.length - 1 ? 0 : currentIndex + 1;
          this.tabRefs[nextIndex]?.focus();
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          const prevIndex = currentIndex === 0 ? this.tabRefs.length - 1 : currentIndex - 1;
          this.tabRefs[prevIndex]?.focus();
          break;
        }
        case 'Home': {
          event.preventDefault();
          this.tabRefs[0]?.focus();
          break;
        }
        case 'End': {
          event.preventDefault();
          this.tabRefs[this.tabRefs.length - 1]?.focus();
          break;
        }
      }
    }
  };

  render() {
    const { sort, forumType, forumTypeSetting } = this.props;

    const classes = classNames('rc-RepliesSortBar', 'horizontal-box', 'align-items-spacebetween');

    const earliestTabClassNames = generateClassNames(sort, oldestSort);
    const popularActivityTabClassNames = generateClassNames(sort, popularSort);
    const mostRecentTabClassNames = generateClassNames(sort, newestSort);

    // Graded Discussion Prompt sort tabs
    const allPostsClassNames = generateClassNames(forumTypeSetting, allPosts);
    const mySubmissionsOnlyClassNames = generateClassNames(forumTypeSetting, mySubmissionsOnly);

    const tabs = (
      <ul
        className="tabs flex-2 shrink-block sorting-tabs horizontal-box"
        role="tablist"
        onKeyDown={this.handleTabKeyboardControls}
        aria-label={_t('Discussion Filters')}
      >
        <li className={earliestTabClassNames} role="none">
          {/* We use an <a> here instead of a Link because Links in our version of react-router don't allow passing down refs */}
          <a
            id={generateTabId(oldestSort)}
            title="Show oldest replies."
            role="tab"
            // we use react-router to make this a client side navigation, but we still include an href to make the location that is shown on focus accurate
            href={generateUrl(forumType, oldestSort)}
            ref={(ref) => (this.tabRefs[0] = ref)}
            // perform a clientside navigation
            onClick={this.handleLinkNavigation}
            aria-controls={sort === oldestSort ? 'replies-list-tabpanel' : undefined}
            aria-selected={sort === oldestSort}
            tabIndex={sort === oldestSort ? 0 : -1}
          >
            {_t('Earliest')}
          </a>
        </li>
        <li className={popularActivityTabClassNames} role="none">
          <a
            id={generateTabId(popularSort)}
            title="Show most popular replies."
            role="tab"
            href={generateUrl(forumType, popularSort)}
            ref={(ref) => (this.tabRefs[1] = ref)}
            onClick={this.handleLinkNavigation}
            aria-controls={sort === popularSort ? 'replies-list-tabpanel' : undefined}
            aria-selected={sort === popularSort}
            tabIndex={sort === popularSort ? 0 : -1}
          >
            {_t('Top')}
          </a>
        </li>
        <li className={mostRecentTabClassNames} role="none">
          <a
            id={generateTabId(newestSort)}
            title="Show latest replies."
            role="tab"
            href={generateUrl(forumType, newestSort)}
            ref={(ref) => (this.tabRefs[2] = ref)}
            onClick={this.handleLinkNavigation}
            aria-controls={sort === newestSort ? 'replies-list-tabpanel' : undefined}
            aria-selected={sort === newestSort}
            tabIndex={sort === newestSort ? 0 : -1}
          >
            {_t('Most Recent')}
          </a>
        </li>
      </ul>
    );

    const gradedDiscussionPromptTabs = (
      <ul
        className="tabs flex-2 shrink-block sorting-tabs horizontal-box"
        role="tablist"
        onKeyDown={this.handleTabKeyboardControls}
        aria-label={_t('Discussion Filters')}
      >
        <li className={allPostsClassNames} role="none">
          <a
            id={generateTabId(allPosts)}
            title="All Submissions"
            role="tab"
            href={generateUrl(forumType, sort, allPosts)}
            ref={(ref) => (this.tabRefs[0] = ref)}
            onClick={this.handleLinkNavigation}
            aria-controls={forumTypeSetting === allPosts ? 'replies-list-tabpanel' : undefined}
            aria-selected={forumTypeSetting === allPosts}
            tabIndex={forumTypeSetting === allPosts ? 0 : -1}
          >
            {_t('All Submissions')}
          </a>
        </li>
        <li className={mySubmissionsOnlyClassNames} role="none">
          <a
            id={generateTabId(mySubmissionsOnly)}
            title="My Submissions Only"
            role="tab"
            ref={(ref) => (this.tabRefs[1] = ref)}
            href={generateUrl(forumType, sort, mySubmissionsOnly)}
            onClick={this.handleLinkNavigation}
            aria-controls={forumTypeSetting === mySubmissionsOnly ? 'replies-list-tabpanel' : undefined}
            aria-selected={forumTypeSetting === mySubmissionsOnly}
            tabIndex={forumTypeSetting === mySubmissionsOnly ? 0 : -1}
          >
            {_t('My Submissions')}
          </a>
        </li>
      </ul>
    );

    const isGradedDiscussionPrompt = forumType === naptimeForumTypes.gradedDiscussionPrompt;

    return <div className={classes}>{isGradedDiscussionPrompt ? gradedDiscussionPromptTabs : tabs}</div>;
  }
}

export default RepliesSortBar;
