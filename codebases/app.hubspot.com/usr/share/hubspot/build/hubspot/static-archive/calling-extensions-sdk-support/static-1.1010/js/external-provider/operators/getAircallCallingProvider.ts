import CallingProvider from '../../call-provider/records/CallingProvider';
import once from 'transmute/once';
import { AIRCALL } from '../constants/StaticExternalProviderNames';
export var getAircallCallingProvider = once(function () {
  return new CallingProvider({
    name: AIRCALL,
    width: 376,
    height: 666,
    supportsCustomObjects: false
  });
});
export var getIsCallingProviderNameAircall = function getIsCallingProviderNameAircall(callingProvider) {
  return callingProvider === AIRCALL;
};