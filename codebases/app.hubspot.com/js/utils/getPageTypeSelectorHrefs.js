'use es6';

import links from 'crm-legacy-links/links';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import Raven from 'Raven';
import UIRouterIconButton from 'ui-addon-react-router-dom/UIRouterIconButton';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
var SUPPORTED_OBJECT_TYPES = [DEAL, TICKET];
export var getPageTypeSelectorHrefs = function getPageTypeSelectorHrefs(_ref) {
  var objectType = _ref.objectType,
      viewId = _ref.viewId,
      shouldUseNewLinkFormat = _ref.shouldUseNewLinkFormat;

  if (!SUPPORTED_OBJECT_TYPES.includes(objectType)) {
    Raven.captureMessage('Attempted to use Page Type Selector on an unsupported object type', {
      extra: {
        objectType: objectType
      }
    });
  }

  var legacyBoardFunc = objectType === DEAL ? links.dealsBoard : links.ticketsBoard;
  var legacyTableFunc = objectType === DEAL ? links.deals : links.tickets;
  var objectTypeId = ObjectTypesToIds[objectType];
  var boardHref = shouldUseNewLinkFormat ? links.indexFromObjectTypeId({
    objectTypeId: objectTypeId,
    pageType: 'board',
    viewId: viewId,
    includeBaseUrl: false
  }) : legacyBoardFunc(viewId, {
    includeBaseUrl: false
  });
  var tableHref = shouldUseNewLinkFormat ? links.indexFromObjectTypeId({
    objectTypeId: objectTypeId,
    pageType: 'list',
    viewId: viewId,
    includeBaseUrl: false
  }) : legacyTableFunc(viewId, {
    includeBaseUrl: false
  });
  return {
    ButtonComponent: UIRouterIconButton,
    boardHrefProp: {
      to: boardHref
    },
    tableHrefProp: {
      to: tableHref
    }
  };
};