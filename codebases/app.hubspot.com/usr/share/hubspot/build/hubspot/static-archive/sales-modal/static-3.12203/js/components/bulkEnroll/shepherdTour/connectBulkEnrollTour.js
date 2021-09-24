'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UITour from 'ui-shepherd-react/tour/UITour';
import * as BulkEnrollTourSteps from 'sales-modal/constants/BulkEnrollTourSteps';
import styled from 'styled-components';
var StyledUITour = styled(UITour).withConfig({
  displayName: "connectBulkEnrollTour__StyledUITour",
  componentId: "sc-1rhiolo-0"
})(["height:100%;"]);
export default (function (Container) {
  return function (props) {
    return /*#__PURE__*/_jsx(StyledUITour, {
      tour: "bulk-enroll-tour",
      config: {
        steps: [BulkEnrollTourSteps.ALL_CONTACTS, BulkEnrollTourSteps.PERSONALIZE]
      },
      children: /*#__PURE__*/_jsx(Container, Object.assign({}, props))
    });
  };
});