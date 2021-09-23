'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { replaceSpecialTypes } from 'crm_data/filters/FilterPlaceholderResolver';
import GridBulkActions from '../crm_ui/grid/cells/header/GridBulkActions';
import { getCanBulkEditAllDependency } from '../crm_ui/grid/permissions/canBulkEditAllDependency';
import doubleOptInEnabledDependency from '../crm_ui/grid/permissions/doubleOptInEnabledDependency';
import isUngatedForRestrictedSubscriptionsWrite from '../crm_ui/grid/permissions/isUngatedForRestrictedSubscriptionsWrite';
import gdprEnabledDependency from '../crm_ui/permissions/gdprEnabledDependency';
import BulkActionPropsType from '../crm_ui/grid/utils/BulkActionPropsType';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import Raven from 'Raven';
import { useCallback } from 'react';
import Small from 'UIComponents/elements/Small';
import { addCalculatedValues } from '../crm_ui/grid/utils/BulkActionPropsRecord';
import * as ViewToElasticSearchQuery from '../crm_ui/utils/ViewToElasticSearchQuery';
import { Map as ImmutableMap } from 'immutable';
import { useStoreDependency } from 'general-store';

var BulkActionsContainer = function BulkActionsContainer(_ref) {
  var _bulkActionProps = _ref.bulkActionProps,
      bulkActions = _ref.bulkActions,
      bulkMoreDropdownActions = _ref.bulkMoreDropdownActions,
      isCrmObject = _ref.isCrmObject;
  var doiEnabled = useStoreDependency(doubleOptInEnabledDependency);
  var gdprEnabled = useStoreDependency(gdprEnabledDependency); //TODO remove this when scope is migrated

  var hasRestrictedSubscriptionsWrite = useStoreDependency(isUngatedForRestrictedSubscriptionsWrite);
  var view = _bulkActionProps.view,
      objectType = _bulkActionProps.objectType,
      query = _bulkActionProps.query;
  var getCurrentSearchQuery = useCallback(function () {
    var searchQuery = ViewToElasticSearchQuery.transform(view, objectType, ImmutableMap({
      isCrmObject: isCrmObject,
      query: query
    })).toJS();

    if (searchQuery == null) {
      return undefined;
    }

    searchQuery.filterGroups = searchQuery.filterGroups.map(function (filterGroup) {
      filterGroup.filters = replaceSpecialTypes(filterGroup.filters);
      return filterGroup;
    });
    return searchQuery;
  }, [view, objectType, query, isCrmObject]);

  if (doiEnabled === undefined) {
    Raven.captureException('gdpr - bulk action - doiEnabled (Double Opt In) is undefined');
  }

  if (gdprEnabled === undefined) {
    Raven.captureException('gdpr - bulk action - gdprEnabled is undefined');
  }

  var bulkActionPropsWithBulkEdit = useStoreDependency(getCanBulkEditAllDependency, {
    bulkActionProps: _bulkActionProps.merge({
      doiEnabled: doiEnabled,
      gdprEnabled: gdprEnabled,
      query: getCurrentSearchQuery()
    })
  });
  var bulkActionProps = addCalculatedValues(bulkActionPropsWithBulkEdit);
  return /*#__PURE__*/_jsxs("span", {
    children: [/*#__PURE__*/_jsx(Small, {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "topbarContents.selectedCount",
        options: {
          selectedCount: bulkActionProps.get('selectionCount')
        }
      })
    }), /*#__PURE__*/_jsx(GridBulkActions, {
      bulkActionProps: bulkActionProps,
      bulkActions: bulkActions,
      bulkMoreDropdownActions: bulkMoreDropdownActions,
      hasRestrictedSubscriptionsWrite: hasRestrictedSubscriptionsWrite
    })]
  });
};

BulkActionsContainer.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  bulkActions: PropTypes.array,
  bulkMoreDropdownActions: PropTypes.array,
  isCrmObject: PropTypes.bool.isRequired
};
BulkActionsContainer.defaultProps = {
  isCrmObject: false
};
export default BulkActionsContainer;