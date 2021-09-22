import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { answerSorts } from 'bundles/discussions/constants';

import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

import 'css!./__styles__/GradedDiscussionPromptAnswersSortBar';

const { oldestSort, popularSort, newestSort } = answerSorts;

type Props = {
  sort: string;
};

type State = {
  notificationAnnouncement: string;
};

class GradedDiscussionPromptAnswersSortBar extends React.Component<Props, State> {
  static propTypes = {
    sort: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    notificationAnnouncement: '',
  };

  handleSortChange = (event) => {
    const sort = event.target.value;

    this.context.router.push({
      pathname: this.context.router.location.pathname,
      params: this.context.router.params,
      query: Object.assign(this.context.router.location.query, { sort }),
    });

    this.setState({ notificationAnnouncement: _t('Thread sorted') });
  };

  render() {
    const { sort } = this.props;
    const { notificationAnnouncement } = this.state;

    return (
      <div className="graded-discussion-prompt-replies-sort-dropdown">
        <label htmlFor="answer-sort-select">{_t('Sort by: ')}</label>
        <select id="answer-sort-select" value={sort} onChange={this.handleSortChange}>
          <option value={oldestSort}>{_t('Earliest')}</option>
          <option value={popularSort}>{_t('Top')}</option>
          <option value={newestSort}>{_t('Most Recent')}</option>
        </select>

        <A11yScreenReaderOnly tagName="span" role="region" aria-live="assertive" aria-atomic={true}>
          {notificationAnnouncement && <span>{notificationAnnouncement}</span>}
        </A11yScreenReaderOnly>
      </div>
    );
  }
}

export default GradedDiscussionPromptAnswersSortBar;
