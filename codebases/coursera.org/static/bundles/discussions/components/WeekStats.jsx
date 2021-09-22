import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/discussions';

class WeekStats extends React.Component {
  static propTypes = {
    lastAnsweredAt: PropTypes.number,
    forumQuestionCount: PropTypes.number,
  };

  render() {
    const { lastAnsweredAt, forumQuestionCount } = this.props;

    return (
      <div className="rc-WeekStats caption-text color-secondary-text">
        {typeof forumQuestionCount === 'number' && (
          <FormattedMessage message={_t('{forumQuestionCount} threads')} forumQuestionCount={forumQuestionCount} />
        )}

        {!!lastAnsweredAt && (
          <span>
            {typeof forumQuestionCount === 'number' && <span> · </span>}
            <FormattedMessage
              message={_t('Last post {timeSinceLastPost}')}
              timeSinceLastPost={moment(lastAnsweredAt).fromNow()}
            />
          </span>
        )}
      </div>
    );
  }
}

export default WeekStats;
