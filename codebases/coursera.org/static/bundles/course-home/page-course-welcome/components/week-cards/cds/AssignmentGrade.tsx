import React from 'react';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';

import { Item } from 'bundles/course-v2/types/Item';
import { getFormattedGrade } from 'bundles/learner-progress/utils/Item';

import AssignmentLatePenalty from 'bundles/course-home/page-course-welcome/components/week-cards/cds/AssignmentLatePenalty';

type Props = {
  item: Item;
};

class AssignmentGrade extends React.Component<Props> {
  render() {
    const {
      item: { gradingLatePenalty, computedOutcome, resourcePath },
    } = this.props;
    const gradeExists = computedOutcome && computedOutcome.grade !== undefined;

    return (
      <td className="rc-AssignmentGrade" role="cell">
        {/* TODO: (billy): check gradeExists & add <GradeInfoEmptyField /> */}

        {gradeExists && (
          <LearnerAppClientNavigationLink className="nostyle" href={resourcePath} trackingName="week_card_grade">
            {/* Explicitly checking grade to be defined here to avoid type error */}
            {computedOutcome && computedOutcome.grade !== undefined && getFormattedGrade(computedOutcome.grade)}
          </LearnerAppClientNavigationLink>
        )}

        <AssignmentLatePenalty gradingLatePenalty={gradingLatePenalty} computedOutcome={computedOutcome} />
      </td>
    );
  }
}

export default AssignmentGrade;
