'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { useShouldShowCoachingTips } from './hooks/useShouldShowCoachingTips';
export var AsyncCoachingTips = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "coaching-tips" */
    './CoachingTips').then(function (mod) {
      return mod.default;
    });
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  },
  ErrorComponent: function ErrorComponent() {
    return null;
  }
});

var CoachingTipsWrapper = function CoachingTipsWrapper(_ref) {
  var objectType = _ref.objectType;
  var shouldShowCoachingTips = useShouldShowCoachingTips(objectType);
  return shouldShowCoachingTips && /*#__PURE__*/_jsx(AsyncCoachingTips, {});
};

CoachingTipsWrapper.propTypes = {
  objectType: AnyCrmObjectTypePropType.isRequired
};
export default CoachingTipsWrapper;