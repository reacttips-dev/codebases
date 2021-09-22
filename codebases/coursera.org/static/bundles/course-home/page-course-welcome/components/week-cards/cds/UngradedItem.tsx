/** @jsx jsx */
import React from 'react';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';

import ProgressCircle from 'bundles/ui/components/ProgressCircle';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography } from '@coursera/cds-core';

import _t from 'i18n!nls/course-home';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import 'css!./../__styles__/UngradedItem';

type Props = {
  title: string;
  nextItemLink: string;
  totalDuration: number;
  remainingDuration: number;
};

class UngradedItem extends React.Component<Props> {
  render() {
    const { title, nextItemLink, totalDuration, remainingDuration } = this.props;

    const percentComplete = Math.round(((totalDuration - remainingDuration) / totalDuration) * 100);

    return (
      <LearnerAppClientNavigationLink
        href={nextItemLink}
        trackingName="week_card_item_type_progress"
        className="rc-UngradedItem horizontal-box align-items-vertical-center"
      >
        <div className="title flex-1">
          <Typography
            component="span"
            css={css`
              color: #525252;
            `}
          >
            {title}
          </Typography>
        </div>

        <ProgressCircle percentComplete={percentComplete} innerColor="#fafafa" backgroundColor="#DDDDDD" />

        <div className="time-remaining">
          {percentComplete === 100 ? (
            <Typography
              css={css`
                color: #525252;
              `}
            >
              {_t('Done')}
            </Typography>
          ) : (
            <Typography variant="h3semibold">
              <FormattedMessage
                message={_t('{remainingDuration} left')}
                remainingDuration={humanizeLearningTime(remainingDuration)}
              />
            </Typography>
          )}
        </div>
      </LearnerAppClientNavigationLink>
    );
  }
}

export default UngradedItem;
