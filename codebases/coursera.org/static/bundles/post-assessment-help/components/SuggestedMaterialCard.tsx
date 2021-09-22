import React from 'react';
import { Box, Pill, CardV2, CardSection, color } from '@coursera/coursera-ui';
import Retracked from 'js/app/retracked';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import _t from 'i18n!nls/post-assessment-help';
import 'css!./__styles__/SuggestedMaterialCard';

import AssessmentHelpFeedback from './AssessmentHelpFeedback';
import SuggestedItemList from './SuggestedItemList';
import { SuggestedItem } from '../types';

/**
 * `SuggestedMaterialCard` renders a card with suggested material for
 * post-assessment help. It is currently meant to only be embedded in quiz
 * feedback. It is not generically useful for displaying suggested material,
 * but is kept here separately (not with quiz code) since post-assessment
 * help is still experimental.
 *
 * You have some minimal access to restyling by referring to the class name:
 * .rc-SuggestedMaterialCard. Do NOT try to mess with internal classes.
 */
const SuggestedMaterialCard: React.FC<{
  items: SuggestedItem[];
  questionInternalId: string;
}> = ({ items, questionInternalId }) => {
  return (
    <CardV2 rootClassName="rc-SuggestedMaterialCard" showBorder={true}>
      <CardSection rootClassName="card-content">
        <Box rootClassName="card-header" flexDirection="row" alignItems="center" justifyContent="between">
          <Box flexDirection="row" alignItems="center">
            {/* NOTE: We're using this title element as a proxy for tracking visibility on the whole card, since visibility tracking on CUI components doesn't work. */}
            <TrackedDiv
              trackingName="post_quiz_help_card"
              trackingData={{ question_internal_id: questionInternalId }}
              withVisibilityTracking={true}
              className="card-title"
            >
              <strong> {_t('Coursera suggests this material')} </strong>
            </TrackedDiv>
            <Pill
              rootClassName="feature-info-badge"
              fillColor={color.black}
              style={{
                color: color.white,
                height: '1.125rem',
              }}
              label={<span className="beta-label"> {_t('beta')} </span>}
            />
          </Box>
          <AssessmentHelpFeedback questionInternalId={questionInternalId} />
        </Box>
        <SuggestedItemList items={items} itemPadding="5px 18px" />
      </CardSection>
    </CardV2>
  );
};

export default Retracked.createTrackedContainer(({ additionalEventData }: $TSFixMe) => ({
  namespace: {
    app: 'post_assessment_help',
    page: 'quiz',
  },
  ...additionalEventData,
}))(SuggestedMaterialCard);
