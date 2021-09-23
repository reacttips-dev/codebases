'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import AudioDevicePopover from '../components/AudioDevicePopover';
import { getAvailableInputDevices, getAvailableOutputDevices, getSelectedInputDevice, getSelectedOutputDevice, isInputDeviceSupported, isOutputDeviceSupported } from '../selectors/getAudioDeviceSettings';
import { getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    availableInputDevices: getAvailableInputDevices(state),
    availableOutputDevices: getAvailableOutputDevices(state),
    selectedInputDevice: getSelectedInputDevice(state),
    selectedOutputDevice: getSelectedOutputDevice(state),
    isInputDeviceSupported: isInputDeviceSupported(state),
    isOutputDeviceSupported: isOutputDeviceSupported(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

export default compose(connect(mapStateToProps))(AudioDevicePopover);