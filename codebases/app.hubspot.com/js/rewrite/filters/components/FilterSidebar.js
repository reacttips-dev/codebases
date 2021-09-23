'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import H2 from 'UIComponents/elements/headings/H2';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import FullPageError from '../../../errorBoundary/FullPageError';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import FilterEditor from './FilterEditor';
import { usePanelActions } from '../../overlay/hooks/usePanelActions';
import { FAILED, SUCCEEDED } from '../../constants/RequestStatus';
import { useLoadRecentlyUsedProperties } from '../../recentlyUsedProperties/hooks/useLoadRecentlyUsedProperties';

var ErrorBoundaryComponent = function ErrorBoundaryComponent() {
  return /*#__PURE__*/_jsx(UIPanelSection, {
    children: /*#__PURE__*/_jsx(FullPageError, {})
  });
};

var FilterSidebar = function FilterSidebar() {
  var recentlyUsedPropertiesLoadStatus = useLoadRecentlyUsedProperties();
  var areRecentlyUsedPropertiesSettled = [SUCCEEDED, FAILED].includes(recentlyUsedPropertiesLoadStatus);

  var _usePanelActions = usePanelActions(),
      closePanel = _usePanelActions.closePanel;

  return /*#__PURE__*/_jsxs(UIPanel, {
    width: 400,
    "data-selenium-test": "more-filters-panel",
    children: [/*#__PURE__*/_jsxs(UIPanelHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: closePanel
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.moreFilters.header"
        })
      })]
    }), /*#__PURE__*/_jsx(UIPanelBody, {
      style: {
        display: 'flex',
        flexDirection: 'column'
      },
      children: /*#__PURE__*/_jsx(ErrorBoundary, {
        ErrorComponent: ErrorBoundaryComponent,
        boundaryName: "AdvancedFilters_ModalError",
        showRefreshAlert: false,
        children: areRecentlyUsedPropertiesSettled ? /*#__PURE__*/_jsx(FilterEditor, {}) : /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        })
      })
    })]
  });
};

export default FilterSidebar;