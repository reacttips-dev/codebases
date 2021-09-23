'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import * as ExternalOptionTypes from 'customer-data-objects/property/ExternalOptionTypes';
import { ALL_COLUMNS_MIN_RESIZABLE_WIDTH } from './constants/ColumnConstants';
import { BOOLEAN, DATE, DATE_TIME, ENUMERATION, NUMBER, STRING } from 'customer-data-objects/property/PropertyTypes';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { List, Map as ImmutableMap, fromJS, is } from 'immutable';
import { MARKETING_EVENT_TYPE_ID, isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { getIdKey } from 'customer-data-objects/model/ImmutableModel';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import { isAppId, isCurrency, isDuration, isPercentWholeNumber, isPercent, isHtml, isPipelineStageProperty, isPipelineProperty } from 'customer-data-objects/property/PropertyIdentifier';
import { DATA_1, DATA_2, VISIT_DATA_1, VISIT_DATA_2 } from 'customer-data-objects/record/AnalyticsSourceIdentifier';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { referencedObjectTypes } from './constants/referencedObjectTypes';
import AnalyticsDataCell from './cells/AnalyticsDataCell';
import AppNameCell from './cells/AppNameCell';
import AvatarCell from './cells/AvatarCell';
import DateTimeCell from './cells/DateTimeCell';
import DateTimeHeader from './tableComponents/DateTimeHeader';
import DomainCell from './cells/DomainCell';
import DurationCell from './cells/DurationCell';
import EmailCell from './cells/EmailCell';
import EnumCell from './cells/EnumCell';
import FormattedMessage from 'I18n/components/FormattedMessage';
import HtmlCell from './cells/HtmlCell';
import I18n from 'I18n';
import MarketingReasonCell from './cells/MarketingReasonCell';
import NumberCell from './cells/NumberCell';
import PercentageCell from './cells/PercentageCell';
import PortalIdParser from 'PortalIdParser';
import ProfileLinkCell from './cells/ProfileLinkCell';
import PropertyNameToReferenceType from 'customer-data-objects/property/PropertyNameToReferenceType';
import Raven from 'Raven';
import ResolvedCell from './cells/ResolvedCell';
import RestrictedPropertyCell from './cells/RestrictedPropertyCell';
import SafeStorage from 'SafeStorage';
import StatusCell from './cells/StatusCell';
import StringCell from './cells/StringCell';
import ExternalOptionsCell from './cells/ExternalOptionsCell';
import TimezoneTypes from 'I18n/constants/TimezoneTypes';
import currencyColumn from './columns/currencyColumn';
import devLogger from 'react-utils/devLogger';
import emptyFunction from 'react-utils/emptyFunction';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import isEmpty from 'transmute/isEmpty';
import isRecord from 'transmute/isRecord';
import memoize from 'transmute/memoize';
import merge from 'transmute/merge';
import mergeDeep from 'hs-lodash/merge';
import propertyColumn from './columns/propertyColumn';
import propertyProfileColumn from './columns/propertyProfileColumn';
import { CALL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
export var isViewSelected = function isViewSelected(selection) {
  if (selection.isEmpty()) return {
    checked: false
  };
  var allTrue = selection.every(function (x) {
    return get('checked', x) === true;
  });
  if (allTrue) return {
    checked: true,
    indeterminate: false
  };
  var allFalse = selection.every(function (x) {
    return get('checked', x) === false;
  });
  if (allFalse) return {
    checked: false,
    indeterminate: false
  };
  var notUndefined = selection.every(function (x) {
    return get('checked', x) !== undefined;
  });
  if (!allTrue && !allFalse && notUndefined) return {
    checked: false,
    indeterminate: true
  };
  return {
    checked: false,
    indeterminate: false
  };
};
export var maybeObject = function maybeObject(value) {
  return value || {};
};
export var isExternalOptionsProperty = function isExternalOptionsProperty(property, objectTypeOrId) {
  var safeObjectTypeId = ObjectTypesToIds[objectTypeOrId] || objectTypeOrId;
  return isPipelineStageProperty(property, safeObjectTypeId) || isPipelineProperty(property, safeObjectTypeId);
};
export var formatOwner = function formatOwner(owner) {
  var remoteList = owner.remoteList;
  var isActive = remoteList ? remoteList.some(function (remote) {
    return remote.active;
  }) : false;
  var formattedOwner = merge({
    active: isActive
  }, owner);
  return formattedOwner ? formattedOwner.toJS() : {};
};
export var getFromColumnProps = function getFromColumnProps(columnProps, propName) {
  var defaultProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!columnProps) return defaultProp;
  var prop = getIn(['rest', propName], columnProps) || {};
  return mergeDeep(defaultProp, prop);
};
export var readColumns = function readColumns(id) {
  var local = SafeStorage.getItem(id);

  if (local !== 'undefined' && local) {
    return JSON.parse(local);
  }

  return {};
};
export var writeColumns = function writeColumns(id, newColumns) {
  var oldColumns = readColumns(id);
  var joinedColumns = merge(newColumns, oldColumns);
  SafeStorage.setItem(id, JSON.stringify(joinedColumns));
};
export var addWidthToColumns = memoize(function () {
  var columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  var columnWidths = arguments.length > 1 ? arguments[1] : undefined;
  var minColumnWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ALL_COLUMNS_MIN_RESIZABLE_WIDTH;

  if (!columnWidths) {
    return columns;
  }

  var parsedColumnWidths = fromJS(columnWidths).map(function (width) {
    return width < minColumnWidth ? minColumnWidth : width;
  });
  var newColumns = parsedColumnWidths ? columns.map(function (col) {
    var id = get('id', col);
    var width = parsedColumnWidths.get(id);

    if (width) {
      return merge({
        width: width
      }, col);
    }

    return col;
  }) : columns;
  return newColumns;
});
export var updateColumnWidth = function updateColumnWidth(id, newWidths) {
  var newColumns = newWidths.reduce(function (result, item) {
    return result.set(item.id, item.value);
  }, ImmutableMap());
  writeColumns(id, newColumns);
};
export var stringCellTypes = ImmutableMap({
  email: EmailCell,
  website: DomainCell,
  cleaned_domain: DomainCell,
  domain: DomainCell,
  company_info_domain: DomainCell,
  hs_sender_company_domain: DomainCell,
  dealname: ProfileLinkCell,
  subject: ProfileLinkCell,
  hs_event_status: StatusCell
});
export var stringColumnTypes = ImmutableMap({
  email: propertyColumn,
  website: propertyColumn,
  cleaned_domain: propertyColumn,
  domain: propertyColumn,
  company_info_domain: propertyColumn,
  dealname: propertyProfileColumn,
  subject: propertyProfileColumn
});
export var getStringColumnByPropertyName = function getStringColumnByPropertyName(propertyName, options) {
  var column = stringColumnTypes.get(propertyName) || propertyColumn;
  var Cell = stringCellTypes.get(propertyName) || StringCell;
  var getColumnProps = options && options.getColumnProps ? options.getColumnProps : emptyFunction;
  var props = column === propertyProfileColumn ? getColumnProps('label') : getColumnProps(propertyName);
  return column(Object.assign({}, options, {
    Cell: Cell,
    // this is a bit hacky to make sure nothing breaks for now
    // TODO: clean up the getColumnProps function
    props: props,
    extraCellProps: Object.assign({}, props)
  }, props));
};
export var getReferenceType = memoize(function (property) {
  var objectType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ExternalOptionTypes.CONTACT;
  var propertyName = property.get('name');
  var refType = getIn([objectType, propertyName], PropertyNameToReferenceType);
  return get('referencedObjectType', property) || refType;
});
export var getPropertyType = memoize(function (property) {
  return property.get('type');
});
export var getPropertyFieldType = memoize(function (property) {
  return property.get('fieldType');
});
var analyticsDataProperties = [DATA_1, DATA_2, VISIT_DATA_1, VISIT_DATA_2];

var handleColumnNotFound = function handleColumnNotFound(_ref) {
  var propertyName = _ref.propertyName,
      propertyType = _ref.propertyType,
      property = _ref.property;
  var message = "[customer-data-table] Column type not found";
  devLogger.warn({
    message: message + " for property: " + propertyName + ", type: " + propertyType
  });
  Raven.captureException(new Error(message), {
    extra: {
      propertyName: propertyName,
      propertyType: propertyType
    }
  });
  return propertyColumn({
    property: property,
    Cell: StringCell
  });
};

export var propertyTypeCells = {};
export var getColumnForProperty = function getColumnForProperty() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var property = options.property,
      objectType = options.objectType,
      order = options.order,
      _options$getColumnPro = options.getColumnProps,
      getColumnProps = _options$getColumnPro === void 0 ? emptyFunction : _options$getColumnPro,
      _options$getIsUngated = options.getIsUngated,
      getIsUngated = _options$getIsUngated === void 0 ? function () {
    return false;
  } : _options$getIsUngated,
      _options$isRestricted = options.isRestrictedProperty,
      isRestrictedProperty = _options$isRestricted === void 0 ? false : _options$isRestricted;

  if (property) {
    if (isRestrictedProperty) {
      return propertyColumn(Object.assign({}, options, {
        Cell: RestrictedPropertyCell,
        sortable: false
      }));
    }

    var propertyType = getReferenceType(property, objectType) || getPropertyType(property);
    var numberDisplayHint = property.get('numberDisplayHint');
    var propertyName = property.get('name');
    var props = getColumnProps(propertyName) || {}; // HACK: Analytics Data Properties need special resolution because they
    // depend on another property and a bunch of extra logic

    if (analyticsDataProperties.includes(propertyName)) {
      return propertyColumn(Object.assign({}, options, {
        Cell: AnalyticsDataCell
      }));
    } // HACK: Marketing Contact ReasonID requires a special cell to pull the vid
    // off the contact for use in resolving.


    if (propertyName === 'hs_marketable_reason_id') {
      return propertyColumn(Object.assign({}, options, {
        Cell: MarketingReasonCell
      }));
    }
    /**
     * HACK: "Label columns" are currently hardcoded per object type, but we
     * can't do that for portal-defined objects. This should be driven by the
     * object type config metadata, but until we fix the API, this seems like
     * the most reasonable path forward.
     * Followup: https://git.hubteam.com/HubSpot/CRM-Issues/issues/5556
     */


    if (isObjectTypeId(objectType) && order === 0) {
      props = getColumnProps('label');
      return propertyProfileColumn(Object.assign({}, options, {
        Cell: ProfileLinkCell,
        draggable: false,
        props: props,
        extraCellProps: props && props.extraCellProps
      }));
    }

    var getCompanyHeaderLabel = function getCompanyHeaderLabel() {
      var isUngatedForFlexibleAssociations = getIsUngated('flexible-associations');

      if (property.name === 'associatedcompanyid') {
        if (isUngatedForFlexibleAssociations) {
          return I18n.text('customerDataTable.header.primaryCompany');
        }

        return propertyLabelTranslator('Associated Company'); // hard-coded, HubSpot-defined
      } else {
        return property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
      }
    };

    switch (propertyType) {
      case ExternalOptionTypes.COMPANY:
        return propertyColumn(Object.assign({}, options, {
          Cell: ResolvedCell,
          CustomCell: AvatarCell,
          Header: getCompanyHeaderLabel(),
          objectType: referencedObjectTypes.COMPANY,
          sortable: false
        }));

      case ExternalOptionTypes.OWNER:
        return propertyColumn(Object.assign({}, options, {
          Cell: ResolvedCell,
          CustomCell: AvatarCell,
          objectType: referencedObjectTypes.OWNER,
          extraCellProps: props && props.extraCellProps
        }));

      case ExternalOptionTypes.PERSONA:
        return propertyColumn(Object.assign({}, options, {
          Cell: ResolvedCell,
          objectType: ExternalOptionTypes.PERSONA
        }));

      case ExternalOptionTypes.TEAM:
        return propertyColumn(Object.assign({}, options, {
          Cell: ResolvedCell,
          objectType: ExternalOptionTypes.TEAM
        }));

      case ExternalOptionTypes.DEAL_STAGE:
        return propertyColumn(Object.assign({}, options, {
          Cell: ResolvedCell,
          objectType: DEAL
        }));

      case ExternalOptionTypes.CAMPAIGN:
        return propertyColumn(Object.assign({}, options, {
          Cell: ResolvedCell,
          objectType: ExternalOptionTypes.CAMPAIGN
        }));

      case STRING:
        {
          if (isHtml(property)) {
            return propertyColumn(Object.assign({}, options, {
              Cell: HtmlCell
            }, props));
          }

          return getStringColumnByPropertyName(propertyName, options);
        }

      case BOOLEAN:
        return propertyColumn(Object.assign({}, options, {
          // TODO: We might want to re-evaluate using a basic string cell for
          // this but in order to preserve the old grid functionality and
          // reduce the surface area for JIRAs we decided to use a StringCell.
          // See: https://git.hubteam.com/HubSpot/customer-data-table/pull/316
          Cell: StringCell
        }));

      case NUMBER:
        if (isPercentWholeNumber(property) || isPercent(property)) {
          return propertyColumn(Object.assign({}, options, {
            Cell: PercentageCell,
            alignRight: true
          }, props));
        }

        if (isCurrency(property)) return currencyColumn(Object.assign({}, options, {}, props));
        if (isDuration(property)) return propertyColumn(Object.assign({}, options, {
          Cell: DurationCell
        }));
        if (isAppId(property) && objectType === MARKETING_EVENT_TYPE_ID) return propertyColumn(Object.assign({}, options, {
          Header: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataTable.header.eventSource"
          }),
          Cell: AppNameCell
        }));
        return propertyColumn(Object.assign({}, options, {
          Cell: numberDisplayHint === 'unformatted' ? StringCell : NumberCell,
          alignRight: numberDisplayHint !== 'unformatted'
        }, props));
      // TODO: clean up the date time columns

      case DATE_TIME:
        return propertyColumn(Object.assign({}, options, {
          extraCellProps: {
            i18nTimezoneType: TimezoneTypes.USER
          },
          Header: function Header(__) {
            return /*#__PURE__*/_jsx(DateTimeHeader, {
              property: property
            });
          },
          Cell: DateTimeCell
        }));

      case DATE:
        return propertyColumn(Object.assign({}, options, {
          extraCellProps: {
            i18nTimezoneType: TimezoneTypes.UTC,
            showTime: false
          },
          Header: function Header(__) {
            return /*#__PURE__*/_jsx(DateTimeHeader, {
              property: property
            });
          },
          Cell: DateTimeCell
        }, props));

      case ENUMERATION:
        if (isExternalOptionsProperty(property, objectType)) {
          return propertyColumn(Object.assign({}, options, {
            Cell: ExternalOptionsCell
          }, props));
        } else {
          return propertyColumn(Object.assign({}, options, {
            Cell: EnumCell,
            extraCellProps: {
              options: get('options', property),
              isHubspotDefined: get('hubspotDefined', property)
            }
          }, props));
        }

      default:
        if (get('externalOptions', property)) {
          return propertyColumn(Object.assign({}, options, {
            Cell: ResolvedCell,
            objectType: propertyType
          }));
        }

        return handleColumnNotFound(Object.assign({}, options, {
          propertyName: propertyName,
          propertyType: propertyType,
          property: property
        }));
    }
  }

  return ImmutableMap();
};
export var removeEmptyColumns = memoize(function (columns) {
  return columns.filter(function (x) {
    return !isEmpty(x);
  });
});
export var reorderColumns = memoize(function (columns, _ref2) {
  var targetIndex = _ref2.targetIndex,
      sourceIndex = _ref2.sourceIndex,
      callback = _ref2.callback;
  var temp = columns.get(sourceIndex);
  var nextColumns = sourceIndex !== -1 && targetIndex !== -1 ? columns.delete(sourceIndex).insert(targetIndex, temp) : columns;

  if (callback && typeof callback === 'function') {
    callback(nextColumns);
  }

  return nextColumns;
});
export var prependColumn = memoize(function () {
  var columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  var newColumn = arguments.length > 1 ? arguments[1] : undefined;

  if (!newColumn) {
    return columns;
  }

  var id = get('id', newColumn);
  var columnExists = columns.findIndex(function (x) {
    return get('id', x) === id;
  });

  var _columns = columnExists !== -1 ? columns.delete(columnExists) : columns;

  var selectionColumnIndex = _columns.findIndex(function (x) {
    return x.get('order') === -1;
  });

  return selectionColumnIndex === -1 ? _columns.insert(0, newColumn) : _columns.insert(1, newColumn);
});
export var createLinkFromIdAndObjectType = function createLinkFromIdAndObjectType(id, objectType) {
  if (objectType === CALL_TYPE_ID) {
    return "/calls/" + PortalIdParser.get() + "/review/" + id;
  }

  var prefix = isObjectTypeId(objectType) ? 'record/' : '';
  return id && objectType ? "/contacts/" + PortalIdParser.get() + "/" + prefix + objectType.toLowerCase() + "/" + id + "/" : null;
};
export var orderColumns = function orderColumns(columns) {
  return columns.sortBy(function (column) {
    return get('order', column);
  });
};
export var mergeColumns = memoize(function (source, updates) {
  return updates.reduce(function (acc, item) {
    var sourceMatch = source.findIndex(function (x) {
      return get('id', x) === get('id', item);
    });
    return sourceMatch > -1 ? acc.set(sourceMatch, item) : acc.push(item);
  }, source);
});
export var updateColumns = memoize(function () {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  var updates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : List();

  if (isEmpty(source)) {
    return updates;
  }

  if (is(source, updates)) {
    return source;
  }

  return mergeColumns(source, updates).sortBy(function (x) {
    return get('order', x);
  });
});
export var getPropertyOrValue = function getPropertyOrValue(record, value) {
  if (isRecord(record)) {
    return getProperty(record, value);
  }

  return get(value, record);
};
export var getIdFromRecordOrValue = function getIdFromRecordOrValue(record) {
  return get('id', record) || get('vid', record) || get('company-id', record) || get('companyId', record) || get('ownerId', record) || get('objectId', record) || get('dealId', record);
}; // HACK: this type of funtion with hard coded ID types needs to be removed in the future

export var getIdTypeFromRecordOrValue = function getIdTypeFromRecordOrValue(record) {
  var recordIdKey = getIdKey(record); // getIdKey returns an array

  if (recordIdKey && recordIdKey.length >= 1) {
    return recordIdKey[0];
  }

  var idKeys = [// id should always be checked first
  'id', 'company-id', 'companyId', 'dealId', 'objectId', 'ownerId', 'vid'];
  var objectIdKey = idKeys.reduce(function (arr, key) {
    if (get(key, record)) {
      return [].concat(_toConsumableArray(arr), [key]);
    }

    return arr;
  }, []);

  if (objectIdKey && objectIdKey.length >= 1) {
    return objectIdKey[0];
  }

  return undefined;
};
export var maybeRowId = memoize(function (row) {
  if (row) {
    var original = get('_original', row);
    if (original) return getIdFromRecordOrValue(original);
  }

  return null;
});
export var removeColumns = function removeColumns(columns, idsToRemove) {
  if (isEmpty(columns)) {
    return List();
  }

  return idsToRemove.reduce(function (acc, id) {
    var indexToRemove = acc.findIndex(function (x) {
      return x.get('id') === id;
    });
    return acc.delete(indexToRemove);
  }, columns);
}; // HACK: This should be expanded into a full "Get Label" function

export var getTicketSubject = function getTicketSubject(record) {
  return get('subject', record) || getIn(['properties', 'subject', 'value'])(record) || undefined;
};
export var hasDealSplit = function hasDealSplit(original) {
  return Number(getIn(['properties', 'hs_num_associated_deal_splits', 'value'], original)) > 1;
};