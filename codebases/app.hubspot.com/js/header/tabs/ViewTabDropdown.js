'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { CrmLogger } from 'customer-data-tracking/loggers';
import * as PinnedViewsActions from '../../pinnedViews/actions/PinnedViewsActions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIList from 'UIComponents/list/UIList';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import ViewsActions from '../../crm_ui/flux/views/ViewsActions';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { usePinnedViewsActions } from '../../rewrite/pinnedViews/hooks/usePinnedViewsActions';
import * as ViewIdMapping from '../../crm_ui/views/ViewIdMapping';
import emptyFunction from 'react-utils/emptyFunction';
import { unique } from '../../utils/unique';

var disabledTextMaxViews = /*#__PURE__*/_jsx(FormattedMessage, {
  message: "indexPage.tabs.actions.disabledTooltip.pinView"
});

var disabledTextUnpinDefault = /*#__PURE__*/_jsx(FormattedMessage, {
  message: "indexPage.tabs.actions.disabledTooltip.unpinView"
});

var disabledTextDefaultView = /*#__PURE__*/_jsx(FormattedMessage, {
  message: "indexPage.tabs.actions.disabledTooltip.makeDefault"
});

export var useSetPinnedViewsAction = function useSetPinnedViewsAction(_ref) {
  var objectType = _ref.objectType;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _usePinnedViewsAction = usePinnedViewsActions(),
        setPinnedViews = _usePinnedViewsAction.setPinnedViews; // TODO: Remove ViewIdMapping when BE understands strings
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/310 for context


    return function (ids) {
      return setPinnedViews(ids.map(ViewIdMapping.lookup));
    };
  } // .bind used here to give both callbacks the same signature


  return PinnedViewsActions.update.bind(null, objectType);
};

var useSetDefaultViewAction = function useSetDefaultViewAction(_ref2) {
  var objectType = _ref2.objectType;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // HACK: With the transition to treating the first pinned view as the user's default view,
    // we no longer need an explicit "set default view" function. However since we're trying
    // to interop with the old code we unfortunately need to pass something.. Hence, emptyFunction.
    return emptyFunction;
  }

  return ViewsActions.makeDefault.bind(null, objectType);
};

var ViewTabDropdown = function ViewTabDropdown(_ref3) {
  var objectType = _ref3.objectType,
      view = _ref3.view,
      isDefaultView = _ref3.isDefaultView,
      isPinnedView = _ref3.isPinnedView,
      hasMaxPinnedViews = _ref3.hasMaxPinnedViews,
      pinnedViews = _ref3.pinnedViews;
  var setPinnedViews = useSetPinnedViewsAction({
    objectType: objectType
  });
  var setDefaultView = useSetDefaultViewAction({
    objectType: objectType
  });

  var handleUnpinView = function handleUnpinView() {
    var newPinnedViewKeys = pinnedViews.filter(function (pinnedView) {
      return pinnedView.id !== view.id;
    }).map(function (newPinnedView) {
      return "" + newPinnedView.key;
    });
    setPinnedViews(newPinnedViewKeys);
    CrmLogger.log('filterUsage', {
      action: 'unpin view',
      subscreen2: 'view-tab'
    });
  };

  var handlePinView = function handlePinView() {
    var hasViewToAdd = pinnedViews.find(function (pinnedView) {
      return pinnedView.id === view.id;
    });

    if (hasViewToAdd) {
      return;
    }

    var newPinnedViewKeys = pinnedViews.concat(view).map(function (newPinnedView) {
      return "" + newPinnedView.key;
    });
    setPinnedViews(newPinnedViewKeys);
    CrmLogger.log('filterUsage', {
      action: 'pin view',
      subscreen2: 'view-tab'
    });
  };

  var handleMakeDefaultView = function handleMakeDefaultView() {
    var newPinnedViewKeys = unique([view.key].concat(_toConsumableArray(pinnedViews.map(function (_ref4) {
      var key = _ref4.key;
      return String(key);
    }))));
    setPinnedViews(newPinnedViewKeys);
    setDefaultView(view.id, view.data.name);
    CrmLogger.log('filterUsage', {
      action: 'make default view',
      subscreen2: 'view-tab'
    });
  };

  return /*#__PURE__*/_jsxs(UIList, {
    children: [isPinnedView ? /*#__PURE__*/_jsx(UITooltip, {
      disabled: !isDefaultView,
      title: disabledTextUnpinDefault,
      children: /*#__PURE__*/_jsx(UIButton, {
        "data-test-id": "unpin-view-" + view.id,
        disabled: isDefaultView,
        onClick: handleUnpinView,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.tabs.actions.unpinView"
        })
      })
    }) : /*#__PURE__*/_jsx(UITooltip, {
      disabled: !hasMaxPinnedViews,
      title: disabledTextMaxViews,
      children: /*#__PURE__*/_jsx(UIButton, {
        "data-test-id": "pin-view-" + view.id,
        disabled: hasMaxPinnedViews,
        onClick: handlePinView,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.tabs.actions.pinView"
        })
      })
    }), !isDefaultView && /*#__PURE__*/_jsx(UITooltip, {
      disabled: isPinnedView,
      title: disabledTextDefaultView,
      children: /*#__PURE__*/_jsx(UIButton, {
        "data-test-id": "make-default-view-" + view.id,
        disabled: !isPinnedView,
        onClick: handleMakeDefaultView,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.tabs.actions.makeDefault"
        })
      })
    })]
  });
};

ViewTabDropdown.propTypes = {
  objectType: AnyCrmObjectTypePropType.isRequired,
  hasMaxPinnedViews: PropTypes.bool.isRequired,
  isPinnedView: PropTypes.bool.isRequired,
  view: PropTypes.shape({
    data: PropTypes.instanceOf(ViewRecord).isRequired,
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired
  }),
  isDefaultView: PropTypes.bool.isRequired,
  pinnedViews: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.instanceOf(ViewRecord).isRequired,
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired
  })).isRequired
};
export default ViewTabDropdown;