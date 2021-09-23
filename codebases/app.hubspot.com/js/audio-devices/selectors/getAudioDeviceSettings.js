'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
export var getAudioDevicesFromState = get('audioDevices');
export var getAvailableInputDevices = createSelector([getAudioDevicesFromState], get('availableInputDevices'));
export var getAvailableOutputDevices = createSelector([getAudioDevicesFromState], get('availableOutputDevices'));
export var getSelectedInputDevice = createSelector([getAudioDevicesFromState], get('selectedInputDevice'));
export var getSelectedOutputDevice = createSelector([getAudioDevicesFromState], get('selectedOutputDevice'));
export var isInputDeviceSupported = createSelector([getAudioDevicesFromState], get('isInputDeviceSupported'));
export var isOutputDeviceSupported = createSelector([getAudioDevicesFromState], get('isOutputDeviceSupported'));