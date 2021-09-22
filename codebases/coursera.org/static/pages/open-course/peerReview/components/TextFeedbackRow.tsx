import React from 'react';
import _t from 'i18n!nls/ondemand';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';

import 'css!./__styles__/TextFeedbackRow';

type Props = {
  children: React.ReactNode;
  creatorFullName: string;
  creatorPhotoUrl: string;
  creatorScore: string | undefined | null;
  isAnonymous: boolean;
};

const TextFeedbackRow = (props: Props) => {
  const { creatorFullName, creatorPhotoUrl, creatorScore, children, isAnonymous } = props;
  return (
    <div className="rc-TextFeedbackRow bgcolor-black-g1 horizontal-box">
      <ProfileImageCA
        profile={{
          fullName: creatorFullName,
          photoUrl: creatorPhotoUrl,
          isAnonymous,
        }}
        alt={_t('Photo of learner #{creatorFullName}', { creatorFullName })}
      />
      <div className="text-feedback-wrapper">
        <div className="body-2-text">{creatorFullName}</div>
        {creatorScore && (
          <div className="body-2-text review-score">
            <FormattedMessage message={_t('Score: {creatorScore} points')} creatorScore={creatorScore} />
          </div>
        )}
        {children && <div className="text-feedback-content">{children}</div>}
      </div>
    </div>
  );
};

export default TextFeedbackRow;
