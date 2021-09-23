'use es6';

import once from 'hs-lodash/once';
import I18n from 'I18n';
import { fromJS } from 'immutable';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';

var buildEmail = function buildEmail() {
  return fromJS({
    subject: I18n.text('defaultTasks.noTokens.EMAIL'),
    taskType: TaskTypes.EMAIL
  });
};

var buildCall = function buildCall() {
  return fromJS({
    subject: I18n.text('defaultTasks.noTokens.CALL'),
    taskType: TaskTypes.CALL
  });
};

var buildTodo = function buildTodo() {
  return fromJS({
    subject: I18n.text('defaultTasks.noTokens.TODO'),
    taskType: TaskTypes.TODO
  });
};

var buildLinkedInMessage = function buildLinkedInMessage() {
  return fromJS({
    subject: I18n.text('defaultTasks.noTokens.LINKED_IN_MESSAGE'),
    taskType: TaskTypes.LINKED_IN_MESSAGE
  });
};

var buildLinkedInConnect = function buildLinkedInConnect() {
  return fromJS({
    subject: I18n.text('defaultTasks.noTokens.LINKED_IN_CONNECT'),
    taskType: TaskTypes.LINKED_IN_CONNECT
  });
};

export default {
  EMAIL: once(buildEmail),
  CALL: once(buildCall),
  TODO: once(buildTodo),
  LINKED_IN_MESSAGE: once(buildLinkedInMessage),
  LINKED_IN_CONNECT: once(buildLinkedInConnect)
};