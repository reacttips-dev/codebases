import React from 'react';
import initBem from 'js/lib/bem';
import { color, Label, Caption, Button } from '@coursera/coursera-ui';
import { SvgErrorLine, SvgCheck } from '@coursera/coursera-ui/svg';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/quiz-compound-assessment';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';
import FloatToPercent from 'bundles/primitive-formatting/components/FloatToPercent';
import getLockedTimeDuration from 'bundles/quiz-compound-assessment/lib/util/getLockedTimeDuration';
import GradeInfoTooltip from 'bundles/compound-assessments/components/shared/GradeInfoTooltip';

import {
  BannerStateTypes,
  BannerStateType,
  getIsRemainingAttemptsZero,
  getBannerStateType,
} from 'bundles/quiz-compound-assessment/lib/util/getBannerStateType';

import 'css!./__styles__/AttemptPageTopBanner';

import { ItemGradeCA } from 'bundles/compound-assessments/lib/withItemGrade';

const bem = initBem('AttemptPageTopBanner');

type Props = {
  itemGrade?: ItemGradeCA;
  computedScore?: number;
  maxScore?: number;
  passingFraction?: number;
  isCumulativeGraded?: boolean;
  onKeepLearningClick?: () => void;
  onTryAgainClick?: () => void;
  remainingAttempts?: number;
  lockingConfigurationSummary?: any;
  stateType?: BannerStateType;
};

const getStatusText = (stateType: BannerStateType) => {
  switch (stateType) {
    case BannerStateTypes.PASSED:
      return _t('Congratulations! You passed!');
    case BannerStateTypes.FAILED:
      return _t('Try again once you are ready');
    case BannerStateTypes.FAILED_NO_ATTEMPT_LEFT:
      return _t('You did not pass this assignment');
    default:
      return _t('You finished this assignment');
  }
};

const statusIconsMap = {
  [BannerStateTypes.FAILED]: <SvgErrorLine size={36} color={color.error} />,
  [BannerStateTypes.FAILED_NO_ATTEMPT_LEFT]: <SvgErrorLine size={36} color={color.error} />,
  [BannerStateTypes.FINISHED]: <SvgCheck size={36} color={color.success} />,
  [BannerStateTypes.PASSED]: <SvgCheck size={36} color={color.success} />,
};

const getButtons = (
  stateType: BannerStateType,
  onKeepLearningClick?: () => void,
  onTryAgainClick?: () => void,
  isTryAgainDisabled?: boolean
) => {
  if (stateType === BannerStateTypes.FAILED) {
    if (onTryAgainClick) {
      return (
        <Button
          size="sm"
          type="primary"
          label={_t('Try again')}
          onClick={onTryAgainClick}
          disabled={isTryAgainDisabled}
        />
      );
    }
  } else if (onKeepLearningClick) {
    return <Button size="sm" type="primary" label={_t('Keep Learning')} onClick={onKeepLearningClick} />;
  }
  return null;
};

class AttemptPageTopBanner extends React.Component<Props> {
  componentDidMount() {
    // scroll tunnel vision to the top after this component shows up
    document.getElementsByClassName('rc-TunnelVisionWrapper__content')[0].scrollTop = 0;
  }

  render() {
    const {
      itemGrade,
      computedScore,
      maxScore,
      passingFraction,
      isCumulativeGraded,
      onKeepLearningClick,
      onTryAgainClick,
      lockingConfigurationSummary,
      remainingAttempts,
      stateType: stateTypeOverride,
    } = this.props;
    const { grade = 0, isPassed } = itemGrade || {};
    const attemptLimitTimeLeft = getLockedTimeDuration(lockingConfigurationSummary);
    const isRemainingAttemptsZero = getIsRemainingAttemptsZero(remainingAttempts);
    const isTryAgainDisabled = isRemainingAttemptsZero || typeof attemptLimitTimeLeft === 'number';
    const stateType = stateTypeOverride || getBannerStateType(isPassed, isCumulativeGraded, remainingAttempts);

    return (
      <div className={bem(undefined, stateType)}>
        <div className={bem('content')}>
          <div className={bem('left-side-content')}>
            <div className={bem('status-container')}>
              <div className={bem('status-icon')}>{statusIconsMap[stateType]}</div>
              <div className={bem('status-text')}>
                {getStatusText(stateType)}
                {typeof passingFraction === 'number' && !isCumulativeGraded && (
                  <div className={bem('passing-data')}>
                    <Label tag="span">{_t('To Pass')}</Label>
                    &nbsp;
                    <Caption tag="span">
                      <FormattedMessage
                        message={_t('{minPercentage} or higher')}
                        minPercentage={<FloatToPercent value={passingFraction} />}
                      />
                    </Caption>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={bem('right-side-content')}>
            <div className={bem('button-group', { buttonDisabled: isTryAgainDisabled })}>
              <div className={bem('button-container')}>
                {getButtons(stateType, onKeepLearningClick, onTryAgainClick, isTryAgainDisabled)}
              </div>
              {isTryAgainDisabled && (
                <div className={bem('attempt-info')}>
                  <Caption>
                    {isRemainingAttemptsZero && _t('No Attempts Left')}
                    {!isRemainingAttemptsZero && typeof attemptLimitTimeLeft === 'number' && (
                      <FormattedMessage
                        message={_t('Retake the assignment in {attemptLimitTimeLeft}')}
                        attemptLimitTimeLeft={<strong>{humanizeLearningTime(attemptLimitTimeLeft)}</strong>}
                      />
                    )}
                  </Caption>
                </div>
              )}
            </div>
            <div className={bem('grade-info')}>
              <div className={bem('grade-label')}>
                <Label tag="span">{_t('Grade')}</Label>
              </div>
              <div className={bem('grade-percent', stateType)}>
                <FloatToPercent value={grade} />
                <GradeInfoTooltip
                  {...{
                    itemGrade,
                    computedScore,
                    maxScore,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AttemptPageTopBanner;
