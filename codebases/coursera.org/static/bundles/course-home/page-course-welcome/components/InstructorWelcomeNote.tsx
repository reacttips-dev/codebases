import React from 'react';
import _ from 'underscore';
import Naptime from 'bundles/naptimejs';
import waitFor from 'js/lib/waitFor';
import connectToRouter from 'js/lib/connectToRouter';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';
import type { Theme } from '@coursera/cds-core';
import { useTheme } from '@coursera/cds-core';

import InstructorNote from 'bundles/course-v2/components/cds/InstructorNote'; // Make file CDS

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import InstructorsV1 from 'bundles/naptimejs/resources/instructors.v1';

import OnDemandInstructorNotesV1 from 'bundles/naptimejs/resources/onDemandInstructorNotes.v1';

// TODO: Remove dependency on onDemandTutorialViews
import onDemandTutorialViewsApi from 'bundles/ondemand/utils/onDemandTutorialViewsApi';

import type { Instructor } from 'bundles/course-v2/types/Course';

import _t from 'i18n!nls/course-v2';

type InstructorNoteType = {
  id: string;
  body: string; // TODO: this is HTML markup.
  context: {
    typeName: string; // TODO
    definition: {
      courseId: string;
      position: string; // TODO
    };
  };
};

type Props = {
  course: { id: string };
  instructors: Array<Instructor>;
  instructorNotes: Array<InstructorNoteType>;
  theme: Theme;
};

type State = {
  isDismissed: boolean;
};

export class InstructorWelcomeNote extends React.Component<Props, State> {
  state = { isDismissed: true };

  componentDidMount() {
    const { course } = this.props;

    onDemandTutorialViewsApi.hasKey(`dismissedWelcomeMessage.${course.id}`).then((isDismissed) => {
      this.setState({ isDismissed });
    });
  }

  handleDismiss = () => {
    const {
      course: { id },
    } = this.props;
    onDemandTutorialViewsApi.storeKey(`dismissedWelcomeMessage.${id}`).then(() => {
      this.setState({ isDismissed: true });
    });
  };

  render() {
    const { isDismissed } = this.state;
    const { instructorNotes, instructors, theme } = this.props;

    if (!instructorNotes || instructorNotes.length === 0 || isDismissed) {
      return null;
    }

    return (
      <InstructorNote
        title={_t("Instructor's Note")}
        note={instructorNotes[0].body}
        instructors={instructors}
        canDismiss
        onDismiss={this.handleDismiss}
        theme={theme}
      />
    );
  }
}

const InstructorWelcomeNoteWithTheme = (props: Props) => {
  const theme = useTheme();

  return <InstructorWelcomeNote {...props} theme={theme} />;
};

export default _.compose(
  deferToClientSideRender(),
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: $TSFixMe) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['id', 'instructorIds'],
    }),
  })),
  waitFor(({ course }) => !!course && !!course.instructorIds),
  Naptime.createContainer(({ course }: $TSFixMe) => ({
    instructors: InstructorsV1.multiGet(course.instructorIds, {
      fields: ['id', 'fullName', 'photo'],
    }),
    instructorNotes: OnDemandInstructorNotesV1.byCourse(course.id),
  }))
)(InstructorWelcomeNoteWithTheme);
