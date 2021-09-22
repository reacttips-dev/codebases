import React from 'react';
import _ from 'underscore';
import { OverlayTrigger, Tooltip } from 'react-bootstrap-33';

import {
  SvgReviewYourPeers,
  SvgDiscussionForum,
  SvgVideo,
  SvgProgrammingAssignment,
  SvgQuiz,
  SvgReading,
  SvgLockFilled,
  SvgGradedAssignment,
  SvgBrowser,
  SvgLTI,
  SvgCircleWarningOutline,
} from '@coursera/coursera-ui/svg';

import constants from 'pages/open-course/common/constants';

import _t from 'i18n!nls/item';

import { ItemType } from 'bundles/item/types/ItemType';

const {
  items: { assessmentTypes, gradableTypes },
} = constants;

const map = {
  closedPeer: SvgReviewYourPeers,
  discussionPrompt: SvgDiscussionForum,
  gradedDiscussionPrompt: SvgDiscussionForum,
  exam: SvgQuiz,
  gradedLti: SvgLTI,
  gradedPeer: SvgReviewYourPeers,
  gradedProgramming: SvgProgrammingAssignment,
  lecture: SvgVideo,
  notebook: SvgProgrammingAssignment,
  lock: SvgLockFilled,
  peer: SvgReviewYourPeers,
  phasedPeer: SvgGradedAssignment,
  programming: SvgProgrammingAssignment,
  quiz: SvgQuiz,
  review: SvgReading,
  splitPeerReviewItem: SvgReviewYourPeers,
  staffGraded: SvgGradedAssignment,
  supplement: SvgReading,
  teammateReview: SvgReviewYourPeers,
  ungradedLti: SvgLTI,
  ungradedWidget: SvgProgrammingAssignment,
  ungradedProgramming: SvgProgrammingAssignment,
  workspaceLauncher: SvgBrowser,
  ungradedLab: SvgBrowser,
  wiseFlow: SvgLTI,
  gradedPlaceholder: SvgCircleWarningOutline,
  ungradedPlaceholder: SvgCircleWarningOutline,
  placeholder: SvgCircleWarningOutline,
  // currently pseudo-items for the learning experience
  singleQuestionSubmit: undefined,
  assessOpenSinglePage: undefined,
  lessonChoice: undefined,
  assignmentGroup: undefined,
};

type Props = {
  type: ItemType;
  size: number;
  title?: string;
  style?: object;
  color?: string;
  hasTooltip?: boolean;
  ariaHidden?: boolean;
};

class ItemIcon extends React.Component<Props> {
  static defaultProps = {
    size: 15,
    hasTooltip: false,
    ariaHidden: false,
  };

  renderIcon() {
    const { type, size, style, title, ariaHidden, color } = this.props;
    const IconComponent = map[type];

    if (IconComponent) {
      return (
        <div className="rc-ItemIcon horizontal-box">
          <IconComponent size={size} style={style} title={title} color={color} aria-hidden={ariaHidden} />
        </div>
      );
    } else {
      return <span />;
    }
  }

  render() {
    const { type, hasTooltip } = this.props;

    const isAssessment = _(assessmentTypes).contains(type);
    const isGradedAssessment = _(gradableTypes).contains(type);

    let ItemToolTip: React.ReactNode | null = null;
    let tooltipText: string | null = null;

    if (hasTooltip) {
      if (isGradedAssessment) {
        tooltipText = _t('Graded assessment');
      } else if (isAssessment) {
        tooltipText = _t('Practice or optional assessment');
      } else if (type === 'supplement') {
        tooltipText = _t('Reading');
      } else if (type === 'discussionPrompt') {
        tooltipText = _t('Discussion Prompt');
      } else if (type === 'notebook') {
        tooltipText = _t('Notebook');
      } else if (type === 'lecture') {
        tooltipText = _t('Video');
      } else if (type === 'wiseFlow') {
        tooltipText = 'WISEflow'; // not translating brandname
      } else {
        tooltipText = null;
      }
      ItemToolTip = <Tooltip> {tooltipText} </Tooltip>;
    }

    return hasTooltip && tooltipText ? (
      <OverlayTrigger placement="top" overlay={ItemToolTip}>
        {this.renderIcon()}
      </OverlayTrigger>
    ) : (
      this.renderIcon()
    );
  }
}

export default ItemIcon;
