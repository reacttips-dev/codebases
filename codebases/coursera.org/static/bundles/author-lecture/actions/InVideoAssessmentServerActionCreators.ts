import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import { InVideoAssessmentActions } from 'bundles/author-lecture/constants/InVideoAssessmentConstants';

const InVideoAssessmentServerActionCreators = {
  receiveInVideoAssessment(inVideoAssessmentAuthoringData: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: InVideoAssessmentActions.RECEIVE_IN_VIDEO_ASSESSMENT,
      inVideoAssessmentAuthoringData,
    });
  },
};

export default InVideoAssessmentServerActionCreators;

export const { receiveInVideoAssessment } = InVideoAssessmentServerActionCreators;
