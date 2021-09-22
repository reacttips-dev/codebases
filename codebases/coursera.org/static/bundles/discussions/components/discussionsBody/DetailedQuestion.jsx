import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import CML from 'bundles/cml/components/CML';
import ModerationDropdown from 'bundles/discussions/components/ModerationDropdown';
import ProfileArea from 'bundles/discussions/components/profiles/ProfileArea';
import AdminDetails from 'bundles/discussions/components/AdminDetails';
import Badge from 'bundles/discussions/components/Badge';
import NextViewLink from 'bundles/discussions/components/NextViewLink';
import CreatedTimeLink from 'bundles/discussions/components/CreatedTimeLink';
import EditIndicator from 'bundles/discussions/components/EditIndicator';
import ProfileName from 'bundles/discussions/components/ProfileName';
import Upvote from 'bundles/discussions/components/Upvote';
import Follow from 'bundles/discussions/components/Follow';
import ReplyButton from 'bundles/discussions/components/ReplyButton';
import { formatReplyLegendId } from 'bundles/discussions/utils/threadUtils';

import epic from 'bundles/epic/client';

import _t from 'i18n!nls/discussions';
import 'css!bundles/discussions/components/discussionsBody/__styles__/DetailedQuestion';

class DetailedQuestion extends React.Component {
  static propTypes = {
    goToInput: PropTypes.func.isRequired,
    question: PropTypes.object,
    isPinned: PropTypes.bool,
    forumLink: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  onDeleteSuccess = (reason) => {
    const { forumLink } = this.props;
    if (!reason) {
      this.context.router.replace(forumLink);
    }
  };

  render() {
    const { question, forumLink, isPinned, goToInput } = this.props;
    if (!question) return null;
    const isFlagged = (question.flagDetails && question.flagDetails.isActive) || question.isFlagged;
    const questionClasses = classNames('headline-3-text question-header', { flagged: isFlagged });
    const detailsClasses = classNames({ flagged: isFlagged });
    const { creator } = question;
    const replyLegendId = formatReplyLegendId(question);
    const isCustomLabelsEnabled = epic.get('FlexSupport', 'customLabelsEnabled', { course_id: question.courseId });

    return (
      <div className="rc-DetailedQuestion card-rich-interaction horizontal-box">
        <div id={replyLegendId} className="screenreader-only pii-hide">
          <FormattedMessage message={_t("{name}'s Post")} name={creator.fullName} />
        </div>
        <div className="profile">
          <ProfileArea
            externalUserId={creator.externalUserId}
            fullName={creator.fullName}
            profileImageUrl={creator.isDefaultPhoto ? '' : creator.photoUrl || ''}
            courseRole={creator.courseRole}
            helperStatus={creator.helperStatus}
          />
        </div>
        <div className="flex-1">
          <div className="horizontal-box">
            <h3 className={questionClasses}>{question.content.question}</h3>
            {isPinned && <i className="cif-pin cif-lg pin" />}
          </div>
          <div className="metadata caption-text color-secondary-text">
            <ProfileName fullName={creator.fullName} externalId={creator.externalUserId} ariaHidden={true} />
            <Badge creator={creator} />
            {!isCustomLabelsEnabled && <NextViewLink question={question} />}
            <span>&nbsp;·&nbsp;</span>
            <CreatedTimeLink post={question} forumLink={forumLink} />
            <EditIndicator post={question} />
          </div>
          <div className={detailsClasses}>
            <CML cml={question.content.details} className={detailsClasses} />
          </div>
          <div className="action-area horizontal-box align-items-vertical-center caption-text color-secondary-text">
            <Upvote post={question} />
            <ReplyButton handleClick={goToInput} text={_t('Reply')} creator={creator} />
            <Follow question={question} />
          </div>
        </div>
        <AdminDetails post={question} />
        <ModerationDropdown
          onDeleteSuccess={this.onDeleteSuccess}
          creator={creator}
          post={question}
          forumLink={forumLink}
          ariaDescribedBy={replyLegendId}
        />
      </div>
    );
  }
}

export default DetailedQuestion;
