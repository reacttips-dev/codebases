import React from 'react';
import PlagiarismReportLink from 'bundles/compound-assessments/components/plagiarism-detection/PlagiarismReportLink';
import LearnerHelpLink from 'bundles/common/components/LearnerHelpLink';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/ondemand';
import {
  SimilarityChecksResult,
  SimilarityChecksStatus,
  SimilarityChecksStatuses,
} from 'bundles/compound-assessments/components/plagiarism-detection/SimilarityChecks';
import initBem from 'js/lib/bem';
import PlagiarismDetectionResultLayout, {
  RESULT_TYPES,
} from 'bundles/compound-assessments/components/plagiarism-detection/v3/PlagiarismDetectionResultLayout';
import { getErrorMessagesMap } from 'bundles/compound-assessments/components/plagiarism-detection/constants/ErrorMessages';
import { SvgExternalLink } from '@coursera/coursera-ui/svg';
import { color } from '@coursera/coursera-ui';

import 'css!./__styles__/PlagiarismDetectionResult';

const bem = initBem('PlagiarismDetectionResult');

type Props = {
  result?: SimilarityChecksResult;
  refetch: () => Promise<{}>;
  status: SimilarityChecksStatus;
};

const PlagiarismDetectionResult: React.FC<Props> = (props) => {
  const { result, refetch, status } = props;
  if (status === SimilarityChecksStatuses.IN_PROGRESS) {
    return null;
  }

  const failureResult = result?.orgCourseraSimilaritycheckSimilarityCheckFailure;
  const successResult = result?.orgCourseraSimilaritycheckSimilarityCheckSuccess;

  if (failureResult) {
    if (failureResult.errorMsg === 'PROCESSING_ERROR') {
      return (
        <div className={bem()}>
          <PlagiarismDetectionResultLayout type={RESULT_TYPES.RETRY} title={_t('Check again for plagiarism')} />
        </div>
      );
    }
    const errorMessagesMap = getErrorMessagesMap();
    return (
      <div className={bem()}>
        <PlagiarismDetectionResultLayout type={RESULT_TYPES.ERROR} title={_t('Edit your response')}>
          {errorMessagesMap[failureResult.errorMsg]}
        </PlagiarismDetectionResultLayout>
      </div>
    );
  } else if (!successResult) {
    return null;
  }

  const { score, url } = successResult;

  if (score === 0) {
    return (
      <div className={bem()}>
        <PlagiarismDetectionResultLayout type={RESULT_TYPES.NOT_DETECTED} title={_t('Plagiarism not detected')} />
      </div>
    );
  }

  return (
    <div className={bem()}>
      <PlagiarismDetectionResultLayout type={RESULT_TYPES.DETECTED} title={_t('Plagiarism detected')}>
        <div className={bem('description')}>
          <FormattedMessage
            message={_t(
              "Your response has a {percentScore} similarity score. The text matches sources found online or other learner's submissions."
            )}
            percentScore={<strong>{score + '%'}</strong>}
          />
        </div>
        <div className={bem('links')}>
          <PlagiarismReportLink refetch={refetch} link={url} />
          <div className={bem('learner-help-center-link-container')}>
            <LearnerHelpLink
              linkClasses={bem('learner-help-center-link')}
              articleId="360004031371"
              linkText={_t('Learner Help Center')}
            />
            <SvgExternalLink size={20} color={color.primary} />
          </div>
        </div>
      </PlagiarismDetectionResultLayout>
    </div>
  );
};

export default PlagiarismDetectionResult;
