'use es6';

import once from 'hs-lodash/once';
import { HEFFALUMP, OBSIDIAN, OLAF, OZ_LIGHT } from 'HubStyleTokens/colors';
import * as InsertCardPanelViews from 'SequencesUI/constants/InsertCardPanelViews';
import getDefaultTaskMeta from 'SequencesUI/constants/getDefaultTaskMeta';
var TEMPLATE_ICON_BACKGROUND_COLOR = HEFFALUMP;
var TEMPLATE_ICON_COLOR = OLAF;
var TASK_ICON_BACKGROUND_COLOR = OZ_LIGHT;
var TASK_ICON_COLOR = OBSIDIAN;
export var getBasicOptions = once(function () {
  return [{
    dataSeleniumTest: 'sequences-choose-step-type-automated-email',
    backgroundColor: TEMPLATE_ICON_BACKGROUND_COLOR,
    iconColor: TEMPLATE_ICON_COLOR,
    iconName: 'send',
    titleMessage: 'edit.stepTypeSelection.title.autoEmail',
    descriptionMessage: 'edit.stepTypeSelection.description.autoEmail',
    panel: InsertCardPanelViews.TEMPLATES
  }, {
    backgroundColor: TASK_ICON_BACKGROUND_COLOR,
    iconColor: TASK_ICON_COLOR,
    iconName: 'email',
    titleMessage: 'edit.stepTypeSelection.title.manualEmail',
    descriptionMessage: 'edit.stepTypeSelection.description.manualEmail',
    panel: InsertCardPanelViews.TASK_FORM,
    taskMeta: getDefaultTaskMeta.EMAIL()
  }, {
    dataSeleniumTest: 'sequences-choose-step-type-call',
    backgroundColor: TASK_ICON_BACKGROUND_COLOR,
    iconColor: TASK_ICON_COLOR,
    iconName: 'calling',
    titleMessage: 'edit.stepTypeSelection.title.call',
    descriptionMessage: 'edit.stepTypeSelection.description.call',
    panel: InsertCardPanelViews.TASK_FORM,
    taskMeta: getDefaultTaskMeta.CALL()
  }, {
    backgroundColor: TASK_ICON_BACKGROUND_COLOR,
    iconColor: TASK_ICON_COLOR,
    iconName: 'tasks',
    titleMessage: 'edit.stepTypeSelection.title.todo',
    descriptionMessage: 'edit.stepTypeSelection.description.todo',
    panel: InsertCardPanelViews.TASK_FORM,
    taskMeta: getDefaultTaskMeta.TODO()
  }];
});
export var getLinkedInOptions = once(function () {
  return [{
    backgroundColor: TASK_ICON_BACKGROUND_COLOR,
    iconColor: TASK_ICON_COLOR,
    iconName: 'socialBlockLinkedin',
    titleMessage: 'edit.stepTypeSelection.title.LinkedInMessage',
    descriptionMessage: 'edit.stepTypeSelection.description.LinkedInMessage',
    panel: InsertCardPanelViews.TASK_FORM,
    taskMeta: getDefaultTaskMeta.LINKED_IN_MESSAGE()
  }, {
    backgroundColor: TASK_ICON_BACKGROUND_COLOR,
    iconColor: TASK_ICON_COLOR,
    iconName: 'socialBlockLinkedin',
    titleMessage: 'edit.stepTypeSelection.title.LinkedInConnect',
    descriptionMessage: 'edit.stepTypeSelection.description.LinkedInConnect',
    panel: InsertCardPanelViews.TASK_FORM,
    taskMeta: getDefaultTaskMeta.LINKED_IN_CONNECT()
  }];
});