'use es6';

import { generatePath } from 'react-router-dom';
import links from 'crm-legacy-links/links';
import PortalIdParser from 'PortalIdParser';
import { DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
var portalId = PortalIdParser.get(); // Deals and tickets still live within legacy pipeline settings so their links
// are generated differently. When we've migrated them to use the cobject settings
// code we can remove the special-casing here.

export var getPipelineSettingsHref = function getPipelineSettingsHref(_ref) {
  var objectTypeId = _ref.objectTypeId,
      pipelineId = _ref.pipelineId;

  switch (objectTypeId) {
    case DEAL_TYPE_ID:
      {
        return links.settings('deals', {
          subsection: pipelineId
        });
      }

    case TICKET_TYPE_ID:
      {
        return links.settings('tickets', {
          subsection: pipelineId
        });
      }

    default:
      {
        return generatePath('/pipelines-settings/:portalId/object/:objectTypeId/:pipelineId?', {
          portalId: portalId,
          objectTypeId: objectTypeId,
          pipelineId: pipelineId
        });
      }
  }
};