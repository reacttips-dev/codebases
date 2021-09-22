import _ from 'underscore';
import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import { InVideoQuestionActions } from 'bundles/author-lecture/constants/InVideoQuestionConstants';
import QuestionDispatcher from 'bundles/author-questions/QuestionDispatcher';
import { Actions as QuestionActions } from 'bundles/author-questions/constants/QuestionConstants';

// To get around the differences in questionAuthoringData vs inVideoQuestionAuthoringData models
import { getQuestionAuthoringData } from 'bundles/author-lecture/utils/QuestionAuthoringDataTransforms';

const InVideoQuestionServerActions = {
  receiveNewInVideoQuestion(inVideoQuestionAuthoringData: $TSFixMe) {
    const { id } = inVideoQuestionAuthoringData;

    // Note: QuestionDispatcher has to be updated before LectureDispatcher
    QuestionDispatcher.handleServerAction({
      type: QuestionActions.RECEIVE_NEW_QUESTION,
      question: getQuestionAuthoringData(inVideoQuestionAuthoringData),
      id,
    });

    // TODO: Consolidate into assessment action creators
    LectureDispatcher.handleServerAction({
      type: InVideoQuestionActions.RECEIVE_NEW_IN_VIDEO_QUESTION,
      inVideoQuestionAuthoringData,
    });
  },

  receiveAllInVideoQuestions(
    inVideoQuestionAuthoringDataList: $TSFixMe,
    cuePointMsMaps: $TSFixMe,
    orderMaps: $TSFixMe
  ) {
    QuestionDispatcher.handleServerAction({
      type: QuestionActions.RECEIVE_ALL_QUESTIONS,
      questions: _(inVideoQuestionAuthoringDataList).map(getQuestionAuthoringData),
    });

    // Note: QuestionDispatcher has to be updated before LectureDispatcher
    LectureDispatcher.handleServerAction({
      type: InVideoQuestionActions.RECEIVE_ALL_IN_VIDEO_QUESTIONS,
      cuePointMsMaps,
      orderMaps,
    });
  },
};

export default InVideoQuestionServerActions;

export const { receiveNewInVideoQuestion, receiveAllInVideoQuestions } = InVideoQuestionServerActions;
