import AliceEvent from 'bundles/alice/models/AliceEvent';
import { COURSE_LECTURE_COMPLETE } from 'bundles/alice/constants/AliceEventTypes';

class AliceCourseLectureCompleteEvent extends AliceEvent {
  constructor({ courseBranchId }: $TSFixMe) {
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ type: "COURSE_LECTURE_COMPLETE... Remove this comment to see the full error message
    super({ type: COURSE_LECTURE_COMPLETE, courseBranchId });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'AliceCourseL... Remove this comment to see the full error message
    this.id = `${COURSE_LECTURE_COMPLETE}~${courseBranchId}`;
  }
}

export default AliceCourseLectureCompleteEvent;
