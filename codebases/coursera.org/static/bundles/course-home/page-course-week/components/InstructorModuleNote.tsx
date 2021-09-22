import React from 'react';
import _ from 'underscore';
import Naptime from 'bundles/naptimejs';
import waitFor from 'js/lib/waitFor';

import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';

import InstructorNote from 'bundles/course-v2/components/InstructorNote';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import InstructorsV1 from 'bundles/naptimejs/resources/instructors.v1';

import OnDemandInstructorNotesV1 from 'bundles/naptimejs/resources/onDemandInstructorNotes.v1';

import { Instructor } from 'bundles/course-v2/types/Course';

type InstructorNote = {
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
  title: string;
  moduleDescription: string;
  instructors: Array<Instructor>;
  instructorNote?: InstructorNote;
};

class InstructorModuleNote extends React.Component<Props> {
  render() {
    const { instructorNote, instructors, moduleDescription, title } = this.props;

    let note;

    if (instructorNote && instructorNote.body) {
      note = instructorNote.body;
    } else {
      note = moduleDescription;
    }

    return <InstructorNote title={title} note={note} instructors={instructors} />;
  }
}

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: any) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['id', 'instructorIds'],
    }),
  })),
  waitFor(({ course }) => !!course && !!course.instructorIds),
  Naptime.createContainer(({ course, moduleId }: any) => ({
    instructors: InstructorsV1.multiGet(course.instructorIds, {
      fields: ['id', 'fullName', 'photo'],
    }),

    instructorNotes: OnDemandInstructorNotesV1.byModule({ courseId: course.id, moduleId }),
  })),
  mapProps<{ instructorNote?: InstructorNote }, { instructorNotes: Array<InstructorNote> }>(({ instructorNotes }) => ({
    instructorNote: _(instructorNotes).find((note) => note.context.definition.position === 'start'),
  }))
)(InstructorModuleNote);
