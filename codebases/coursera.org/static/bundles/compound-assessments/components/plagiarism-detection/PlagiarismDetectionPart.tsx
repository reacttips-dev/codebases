import React from 'react';
import PlagiarismReportLink from 'bundles/compound-assessments/components/plagiarism-detection/PlagiarismReportLink';
import { SvgHelp } from '@coursera/coursera-ui/svg';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { Notification, Button } from '@coursera/coursera-ui';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import _t from 'i18n!nls/ondemand';
import {
  SimilarityChecksResult,
  SimilarityChecksStatus,
} from 'bundles/compound-assessments/components/plagiarism-detection/SimilarityChecks';
import initBem from 'js/lib/bem';
import PlagiarismErrorMessage from 'bundles/compound-assessments/components/plagiarism-detection/PlagiarismErrorMessage';

import 'css!./__styles__/PlagiarismDetectionPart';

const bem = initBem('PlagiarismDetectionPart');

type Props = {
  result?: SimilarityChecksResult;
  refetch: () => Promise<{}>;
  status: SimilarityChecksStatus;
};

const PlagiarismDetectionPart = (props: Props) => {
  const { result, refetch, status } = props;
  if (status === 'IN_PROGRESS') {
    return (
      <div className={bem()}>
        <Notification
          message={
            <FormattedMessage
              message={_t(
                'We are running our analysis. This may take a few moments. Please {retry} in a couple of minutes to see your results.'
              )}
              retry={
                <Button
                  type="link"
                  size="zero"
                  label={_t('retry')}
                  onClick={() => {
                    refetch();
                  }}
                />
              }
            />
          }
        />
      </div>
    );
  }

  if (result?.orgCourseraSimilaritycheckSimilarityCheckFailure) {
    return <PlagiarismErrorMessage result={result} />;
  } else if (!result?.orgCourseraSimilaritycheckSimilarityCheckSuccess) {
    return null;
  }

  const { score, url } = result.orgCourseraSimilaritycheckSimilarityCheckSuccess;

  const percentString = score + '%';

  return (
    <div className={bem()}>
      <div className={bem('percent-box')}>{percentString}</div>
      <div className={bem('similarity-score-label')}>{_t('Similarity Score')}</div>
      <OverlayTrigger
        placement="bottom"
        delay={500}
        overlay={
          <Tooltip id="PlagiarismDetectionToolTip">
            {_t('A similarity score indicates the percentage of text matching existing documents')}
          </Tooltip>
        }
      >
        <div className={bem('help-icon')}>
          <SvgHelp size={18} color="#2A73CC" />
        </div>
      </OverlayTrigger>
      <PlagiarismReportLink refetch={refetch} link={url} />
    </div>
  );
};

export default PlagiarismDetectionPart;
