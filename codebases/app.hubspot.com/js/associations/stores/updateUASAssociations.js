'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _updateUASAssociation;

import { handleActions } from 'redux-actions';
import { UPDATE_UAS_ASSOCIATIONS } from '../actions/asyncActionTypes';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceeded } from 'conversations-async-data/async-data/operators/requestSucceeded';
var initialState = AsyncData();
var updateUASAssociations = (_updateUASAssociation = {}, _defineProperty(_updateUASAssociation, UPDATE_UAS_ASSOCIATIONS.STARTED, requestStarted), _defineProperty(_updateUASAssociation, UPDATE_UAS_ASSOCIATIONS.SUCCEEDED, requestSucceeded), _defineProperty(_updateUASAssociation, UPDATE_UAS_ASSOCIATIONS.FAILED, requestFailed), _updateUASAssociation);
export default handleActions(updateUASAssociations, initialState);