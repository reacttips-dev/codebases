'use es6';

import { combineReducers } from 'redux';
import initialLoadSettings from '../initial-load-settings/reducers/initialLoadSettings';
import settingsOmnibus from '../settings-omnibus/reducers/settingsOmnibus';
import callingAdminSettings from '../calling-admin-settings/reducers/callingAdminSettings';
import auth from '../Auth/reducers/auth';
import hubSettings from '../hub-settings/reducers/hubSettings';
import activeCallSettings from '../active-call-settings/reducers/activeCallSettings';
import audioDevices from '../audio-devices/reducers/audioDevices';
import networkQuality from '../network-quality/reducers/networkQuality';
import recordState from '../record/reducers/recordState';
import callDispositions from '../call-types-outcomes/reducers/callDispositions';
import activityTypes from '../call-types-outcomes/reducers/activityTypes';
import calleeProperties from '../callee-properties/reducers/calleeProperties';
import userSettings from '../userSettings/reducers/userSettingsData';
import deviceErrors from '../device-errors/reducers/deviceErrors';
import microphonePermissions from '../microphone-access/reducers/microphonePermissions';
import callingProviders from '../calling-providers/reducers/callingProviders';
import minutesUsage from '../minutes-alert-banner/reducers/minutesUsage';
import thirdPartyCalling from '../third-party-calling/reducers/thirdPartyCalling';
import engagement from '../engagement/reducers/engagement';
import gdprBypass from '../gdpr/reducers/gdprState';
import associations from '../associations/stores/associations';
import registerPhoneNumbersInverse from '../register-number/reducers/registerPhoneNumbersInverse';
import registerPhoneNumberTwilioConnect from '../register-number/reducers/registerPhoneNumberTwilioConnect';
import callees from '../callees/reducers/calleesReducer';
import calleesUpdates from '../callees/reducers/calleesUpdatesReducer';
import addingProperty from '../callees/reducers/addingPropertyReducer';
import validatedNumbers from '../validated-numbers/reducers/validatedNumbersReducer';
import csatFeedback from '../csat-feedback/reducers/csat-feedback';
import onboarding from '../onboarding/reducers/onboarding';
import capabilities from '../capabilities/reducers/capabilitiesReducer';
import taskAssociationDefinitions from '../post-call-actions/reducers/taskAssociationDefinitions';
export default combineReducers({
  auth: auth,
  addingProperty: addingProperty,
  callees: callees,
  calleesUpdates: calleesUpdates,
  calleeProperties: calleeProperties,
  associations: associations,
  initialLoadSettings: initialLoadSettings,
  hubSettings: hubSettings,
  settingsOmnibus: settingsOmnibus,
  activeCallSettings: activeCallSettings,
  engagement: engagement,
  audioDevices: audioDevices,
  networkQuality: networkQuality,
  recordState: recordState,
  callDispositions: callDispositions,
  activityTypes: activityTypes,
  userSettings: userSettings,
  deviceErrors: deviceErrors,
  microphonePermissions: microphonePermissions,
  callingProviders: callingProviders,
  minutesUsage: minutesUsage,
  thirdPartyCalling: thirdPartyCalling,
  gdprBypass: gdprBypass,
  registerPhoneNumbersInverse: registerPhoneNumbersInverse,
  registerPhoneNumberTwilioConnect: registerPhoneNumberTwilioConnect,
  validatedNumbers: validatedNumbers,
  csatFeedback: csatFeedback,
  onboarding: onboarding,
  capabilities: capabilities,
  callingAdminSettings: callingAdminSettings,
  taskAssociationDefinitions: taskAssociationDefinitions
});