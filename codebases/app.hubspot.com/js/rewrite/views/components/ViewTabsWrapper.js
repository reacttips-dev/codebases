'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Seq } from 'immutable';
import withGateOverride from 'crm_data/gates/withGateOverride'; // HACK: We are explicitly importing the version of this component that is not
// wrapped with general-store's connect in order to prevent unncessary fetches
// from general store when running with the rewrite (redux)
// Do not change this import please!

import { ViewTabs } from '../../../header/tabs/ViewTabs';
import { useDefaultViewId } from '../../defaultView/hooks/useDefaultViewId';
import { usePinnedViewIds } from '../../pinnedViews/hooks/usePinnedViewIds';
import { useCurrentView } from '../hooks/useCurrentView';
import { useViews } from '../hooks/useViews';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import * as ViewIdMapping from '../../../crm_ui/views/ViewIdMapping';
import { useNavigate } from '../../navigation/hooks/useNavigate';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';

var ViewTabsWrapper = function ViewTabsWrapper(_ref) {
  var onToggleViewSelectorPage = _ref.onToggleViewSelectorPage;
  var objectTypeId = useSelectedObjectTypeId();
  var views = useViews();
  var currentView = useCurrentView();
  var defaultViewId = useDefaultViewId();
  var pinnedViewIds = usePinnedViewIds();
  var hasAllGates = useHasAllGates();
  var csatSurveyGate = 'CRM:Index:WootricSurveyEnabled';
  var isUngatedForCSATSurvey = withGateOverride(csatSurveyGate, hasAllGates(csatSurveyGate));
  var pinnedViews = useMemo(function () {
    return Seq(pinnedViewIds).map(String).filter(function (id) {
      return views.has(id);
    }).map(function (id) {
      return {
        id: id,
        key: String(ViewIdMapping.get(id)),
        data: views.get(id)
      };
    }).toArray();
  }, [pinnedViewIds, views]);
  var navigate = useNavigate();

  var _useModalActions = useModalActions(),
      openCreateViewModal = _useModalActions.openCreateViewModal;

  return /*#__PURE__*/_jsx(ViewTabs, {
    objectType: objectTypeId,
    views: views,
    currentView: currentView,
    defaultViewId: String(defaultViewId),
    pinnedViews: pinnedViews,
    onChangeView: function onChangeView(viewId) {
      return navigate({
        viewId: viewId
      });
    },
    onCreateView: openCreateViewModal,
    onOpenViewSelectorPage: onToggleViewSelectorPage,
    isUngatedForCSATSurvey: isUngatedForCSATSurvey,
    raisePinnedViewLimit: true
  });
};

ViewTabsWrapper.propTypes = {
  onToggleViewSelectorPage: PropTypes.func.isRequired
};
export default ViewTabsWrapper;