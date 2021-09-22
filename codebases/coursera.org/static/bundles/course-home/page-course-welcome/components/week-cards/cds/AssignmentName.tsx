/** @jsx jsx */
/* eslint-disable import/extensions */
import React from 'react';

// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { Typography } from '@coursera/cds-core';

import type { Item } from 'bundles/course-v2/types/Item';

import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';

import {
  getFormattedTitlePrefix,
  getFormattedTimeCommitment,
  getIsReviewPartForSplitPeer,
  getIsAssignmentPartForSplitPeer,
} from 'bundles/course-v2/utils/Item';

import { rtlStyle } from 'js/lib/language';
import _t from 'i18n!nls/course-home';

import ItemIcon from 'bundles/item/components/ItemIcon';
import AssignmentProgressIcon from '../../AssignmentProgressIcon';

import 'css!./../__styles__/AssignmentName';

type Props = {
  item: Item;
  courseHasVerification?: boolean; // TODO
  theme: Theme;
};

class AssignmentName extends React.Component<Props> {
  render() {
    const { item, courseHasVerification, theme } = this.props;

    const { name, computedProgressState, computedOutcome, itemDeadlineStatus } = item;

    const isInReview = computedProgressState === 'InReview';

    const isItemOverdue = itemDeadlineStatus === 'OVERDUE';

    return (
      <td role="cell" className="rc-AssignmentName">
        <LearnerAppClientNavigationLink
          href={item.resourcePath}
          trackingName="week_card_assignment_name"
          className="nostyle assignment-link"
        >
          {getIsReviewPartForSplitPeer(item) && <div className="vertical-line vertical-line-top" />}
          {getIsAssignmentPartForSplitPeer(item) && <div className="vertical-line vertical-line-bottom" />}

          <div className="horizontal-box">
            <div>
              {isItemOverdue ? (
                <ItemIcon
                  size={22}
                  style={rtlStyle({ marginRight: 10 })}
                  type={item.contentSummary.typeName}
                  ariaHidden={true}
                />
              ) : (
                <AssignmentProgressIcon item={item} style={rtlStyle({ marginRight: 8 })} />
              )}
            </div>

            <div>
              <Typography variant="h3semibold">{getFormattedTitlePrefix(item)}</Typography>
              <Typography
                component="div"
                css={css`
                  max-width: 265px;
                  overflow: hidden;
                  white-space: nowrap;
                `}
              >
                {name}
              </Typography>

              <div className="horizontal-box align-items-vertical-center">
                {!getIsReviewPartForSplitPeer(item) && (
                  <Typography variant="h3semibold">{getFormattedTimeCommitment(item)}</Typography>
                )}

                {computedOutcome && computedOutcome.isUnverifiedPassed && courseHasVerification && (
                  <Typography
                    component="div"
                    variant="body2"
                    color="supportText"
                    css={css`
                      margin: ${theme?.spacing(0, 0, 0, 8)};
                      display: inline-block;
                      height: 20px;
                      border-radius: 10px;
                      padding: ${theme?.spacing(0, 12, 0, 12)};
                      -o-text-overflow: ellipsis;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      background-color: #fff;
                      border-width: 1px;
                      border-color: rgba(0, 0, 0, 0.1);
                      border-style: solid;
                    `}
                  >
                    {_t('Not Verified')}
                  </Typography>
                )}

                {isInReview && (
                  <Typography
                    component="div"
                    variant="body2"
                    color="supportText"
                    css={css`
                      margin: ${theme?.spacing(0, 0, 0, 8)};
                      display: inline-block;
                      height: 20px;
                      border-radius: 10px;
                      padding: ${theme?.spacing(0, 12, 0, 12)};
                      -o-text-overflow: ellipsis;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      background-color: #fff;
                      border-width: 1px;
                      border-color: rgba(0, 0, 0, 0.1);
                      border-style: solid;
                    `}
                  >
                    {_t('Grading in progress')}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </LearnerAppClientNavigationLink>
      </td>
    );
  }
}

export default AssignmentName;
