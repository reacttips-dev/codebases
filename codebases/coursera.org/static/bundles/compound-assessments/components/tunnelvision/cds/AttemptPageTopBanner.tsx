/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/quiz-compound-assessment';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';
import FloatToPercent from 'bundles/primitive-formatting/components/FloatToPercent';
import getLockedTimeDuration from 'bundles/quiz-compound-assessment/lib/util/getLockedTimeDuration';
import GradeInfoTooltip from 'bundles/compound-assessments/components/shared/GradeInfoTooltip';
import { TUNNELVISIONWRAPPER_CONTENT_ID } from 'bundles/compound-assessments/components/tunnelvision/cds/TunnelVisionWrapper';
import type { Theme } from '@coursera/cds-core';
import { Button, Grid, PageGridContainer, Typography } from '@coursera/cds-core';
import { ErrorFilledIcon, SuccessFilledIcon } from '@coursera/cds-icons';

import type { BannerStateType } from 'bundles/quiz-compound-assessment/lib/util/getBannerStateType';
import {
  BannerStateTypes,
  getIsRemainingAttemptsZero,
  getBannerStateType,
} from 'bundles/quiz-compound-assessment/lib/util/getBannerStateType';

import type { ItemGradeCA } from 'bundles/compound-assessments/lib/withItemGrade';

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
  [BannerStateTypes.FAILED]: <ErrorFilledIcon color="error" />,
  [BannerStateTypes.FAILED_NO_ATTEMPT_LEFT]: <ErrorFilledIcon color="error" />,
  [BannerStateTypes.FINISHED]: <SuccessFilledIcon color="success" />,
  [BannerStateTypes.PASSED]: <SuccessFilledIcon color="success" />,
};

const getButtons = (
  stateType: BannerStateType,
  onKeepLearningClick?: () => void,
  onTryAgainClick?: () => void,
  isTryAgainDisabled?: boolean
) => {
  if (stateType === BannerStateTypes.FAILED) {
    if (isTryAgainDisabled) {
      return null;
    }
    if (onTryAgainClick) {
      return (
        <Button variant="primary" onClick={onTryAgainClick}>
          {_t('Try again')}
        </Button>
      );
    }
  } else if (onKeepLearningClick) {
    return (
      <Button variant="primary" onClick={onKeepLearningClick}>
        {_t('Go to next item')}
      </Button>
    );
  }
  return null;
};

const styles = {
  getRootStyles: (stateType: BannerStateType) => (theme: Theme) => {
    if (stateType === BannerStateTypes.FINISHED || stateType === BannerStateTypes.PASSED) {
      return css({
        backgroundColor: theme.palette.green[50],
      });
    }
    return css({
      backgroundColor: theme.palette.red[50],
    });
  },
  innerContainer: (theme: Theme) =>
    css({
      paddingTop: theme.spacing(16),
    }),
  buttonContainer: (theme: Theme) =>
    css({
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row-reverse',
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(24, 0, 8, 32),
        flexDirection: 'row',
      },
    }),
  leftContainer: css({
    display: 'flex',
  }),
  statusIcon: (theme: Theme) =>
    css({
      marginTop: theme.spacing(8),
      marginRight: theme.spacing(12),
    }),
  detailsContainer: (theme: Theme) =>
    css({
      display: 'flex',
      marginTop: theme.spacing(8),
      [theme.breakpoints.only('xs')]: {
        flexDirection: 'column',
      },
    }),
  detailDescription: (theme: Theme) =>
    css({
      marginRight: theme.spacing(16),
    }),
  getGradePercentStyles: (stateType: BannerStateType) => (theme: Theme) => {
    if (stateType === BannerStateTypes.PASSED) {
      return css({
        color: theme.palette.green[700],
      });
    } else if (stateType === BannerStateTypes.FAILED || stateType === BannerStateTypes.FAILED_NO_ATTEMPT_LEFT) {
      return css({
        color: theme.palette.red[700],
      });
    }
    return css({
      color: theme.palette.black[500],
    });
  },
};

class AttemptPageTopBanner extends React.Component<Props> {
  componentDidMount() {
    // scroll tunnel vision to the top after this component shows up
    const tunnelVisionContentNode = document.getElementById(TUNNELVISIONWRAPPER_CONTENT_ID);
    if (tunnelVisionContentNode) {
      tunnelVisionContentNode.scrollTop = 0;
    }
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
      <div css={styles.getRootStyles(stateType)}>
        <PageGridContainer>
          <Grid item container justify="center">
            <Grid item container xs={12} lg={8} css={styles.innerContainer}>
              <Grid item md={9} xs={12}>
                <div css={styles.leftContainer}>
                  <div css={styles.statusIcon}>{statusIconsMap[stateType]}</div>
                  <div>
                    <Typography variant="h1semibold" component="div">
                      {getStatusText(stateType)}
                    </Typography>

                    <div css={styles.detailsContainer}>
                      <div css={styles.detailDescription}>
                        <Typography variant="h2semibold" component="span">
                          {_t('Grade received')}
                        </Typography>
                        &nbsp;
                        <Typography variant="h2" component="span">
                          <span css={styles.getGradePercentStyles(stateType)}>
                            <FloatToPercent value={grade} />
                          </span>
                          <GradeInfoTooltip
                            {...{
                              itemGrade,
                              computedScore,
                              maxScore,
                            }}
                          />
                        </Typography>
                      </div>
                      {typeof passingFraction === 'number' && !isCumulativeGraded && (
                        <div css={styles.detailDescription}>
                          <Typography variant="h2semibold" component="span">
                            {_t('To pass')}
                          </Typography>
                          &nbsp;
                          <Typography variant="h2" component="span">
                            <FormattedMessage
                              message={_t('{minPercentage} or higher')}
                              minPercentage={<FloatToPercent value={passingFraction} />}
                            />
                          </Typography>
                        </div>
                      )}
                      {isRemainingAttemptsZero && (
                        <Typography variant="h2semibold" component="div">
                          {_t('0 Attempt Left')}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item md={3} xs={12} css={styles.buttonContainer}>
                <div>{getButtons(stateType, onKeepLearningClick, onTryAgainClick, isTryAgainDisabled)}</div>
                {isTryAgainDisabled && (
                  <div>
                    <Typography variant="body2" component="span">
                      {!isRemainingAttemptsZero && typeof attemptLimitTimeLeft === 'number' && (
                        <FormattedMessage
                          message={_t('Retake the assignment in {attemptLimitTimeLeft}')}
                          attemptLimitTimeLeft={<strong>{humanizeLearningTime(attemptLimitTimeLeft)}</strong>}
                        />
                      )}
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </PageGridContainer>
      </div>
    );
  }
}

export default AttemptPageTopBanner;
