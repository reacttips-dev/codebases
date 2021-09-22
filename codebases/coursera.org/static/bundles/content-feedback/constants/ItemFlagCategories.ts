/**
 * Flagging categories for different item types
 * @type {Object}
 */

import createLoadableComponent from 'js/lib/createLoadableComponent';
import { isCDSReadingsEnabled } from 'bundles/item-reading/CDSFlags';

import _t from 'i18n!nls/content-feedback';

import ItemTypes from './ItemTypes';

const LoadableFlagFeedbackEditor = createLoadableComponent(
  (): Promise<$TSFixMe> =>
    isCDSReadingsEnabled()
      ? import('bundles/content-feedback/components/cds/flag/FlagFeedbackEditor')
      : import('bundles/content-feedback/components/flag/FlagFeedbackEditor')
);

const LoadableGradingProblemFeedbackEditor = createLoadableComponent(
  () => import('bundles/content-feedback/components/flag/GradingProblemFeedbackEditor')
);

export class Category {
  id = '';

  label = '';

  example = '';

  isPublic = false;

  Component = LoadableFlagFeedbackEditor;

  constructor(id: string, label: string, example?: string, isPublic = false, Component?: any) {
    this.id = id;
    this.label = label;
    this.example = _t('Example: #{example}', { example });
    this.isPublic = !!isPublic;
    this.Component = Component || LoadableFlagFeedbackEditor;
  }

  isHelpful() {
    return this.id === 'helpful';
  }

  // TODO: separate isHelpfulOrConfused from the feedback architecture to avoid changing these to `generic` for API call purposes
  isHelpfulOrConfused() {
    return this.id === 'helpful' || this.id === 'confused';
  }
}

class Technical extends Category {
  constructor(example: string) {
    // technical issues are visible to SU only
    super('technical', _t('Technical issues'), example);
  }
}

class Content extends Category {
  constructor(example: string) {
    super('content', _t('Content improvement'), example, true);
  }
}

class Grading extends Category {
  constructor(example?: string, Component?: any) {
    super('grading', _t('Grading problems'), example, true, Component);
  }
}

class Offensive extends Category {
  constructor() {
    super(
      'offensive',
      _t('Offensive content'),
      _t('The language used in this video by the interviewer is offensive towards women'),
      true
    );
  }
}

function Categories() {
  return {
    [ItemTypes.Quiz]: [
      new Technical(_t("Question 4: The image in the question prompt doesn't load")),
      new Content(_t('Question 5: would like to have more detailed explanation for wrong answers')),
      new Grading(_t('The quiz fails me even when I got 5 out of 7 questions right.')),
      new Offensive(),
    ],

    [ItemTypes.Reading]: [
      new Technical(_t('The second image doesn’t load.')),
      new Content(_t('Please specify chapters in the references.')),
      new Offensive(),
    ],

    [ItemTypes.Lecture]: [
      new Category('video', _t('Video issues'), _t('Video takes too long to load.')),
      new Category('audio', _t('Audio issues'), _t('Audio at 2:35 breaks up and is hard to understand.')),
      new Content(_t('I’d like to see more visuals accompany the bullet points.')),
      new Offensive(),
      new Category('subtitle', _t('Subtitles issues'), _t('Chinese subtitles are out of sync'), true),
    ],

    [ItemTypes.Peer]: [
      new Technical(_t("I'm unable to submit my assignment")),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Offensive(),
    ],

    [ItemTypes.Programming]: [
      new Technical(_t("I'm unable to submit my assignment")),
      new Grading(undefined, LoadableGradingProblemFeedbackEditor),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Offensive(),
    ],

    [ItemTypes.DiscussionPrompt]: [
      new Technical(_t("I'm unable to submit my response")),
      new Content(_t("I didn't understand the question. It could be made clearer by...")),
      new Offensive(),
    ],

    [ItemTypes.Notebook]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Offensive(),
    ],

    [ItemTypes.GradedDiscussionPrompt]: [
      new Technical(_t("I'm unable to submit my response")),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
    ],

    [ItemTypes.StaffGraded]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
    ],

    [ItemTypes.TeammateReview]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
    ],

    [ItemTypes.Widget]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
      new Offensive(),
    ],

    [ItemTypes.UngradedWidget]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
      new Offensive(),
    ],

    [ItemTypes.UngradedLab]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
      new Offensive(),
    ],

    [ItemTypes.Workspace]: [],

    [ItemTypes.GradedLti]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
      new Offensive(),
    ],

    [ItemTypes.UngradedLti]: [
      new Technical(_t('I see an error when I try to ...')),
      new Content(_t("I didn't understand the instructions. They could be made clearer by...")),
      new Grading(_t('The grading rubric could be improved by...')),
      new Offensive(),
    ],
  };
}

export default Categories;
