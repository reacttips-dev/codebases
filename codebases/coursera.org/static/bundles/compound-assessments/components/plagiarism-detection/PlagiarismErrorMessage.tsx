import React from 'react';
import { Notification } from '@coursera/coursera-ui';
import { SimilarityChecksResult } from 'bundles/compound-assessments/components/plagiarism-detection/SimilarityChecks';
import initBem from 'js/lib/bem';
import { getErrorMessagesMap } from 'bundles/compound-assessments/components/plagiarism-detection/constants/ErrorMessages';

const bem = initBem('PlagiarismErrorMessage');

type Props = {
  result: SimilarityChecksResult;
};

const PlagiarismErrorMessage = (props: Props) => {
  const { result } = props;
  const errorMessagesMap = getErrorMessagesMap();

  if (!result.orgCourseraSimilaritycheckSimilarityCheckFailure) {
    return null;
  }

  return (
    <div className={bem()}>
      <Notification
        type="danger"
        message={errorMessagesMap[result.orgCourseraSimilaritycheckSimilarityCheckFailure.errorMsg]}
      />
    </div>
  );
};

export default PlagiarismErrorMessage;
