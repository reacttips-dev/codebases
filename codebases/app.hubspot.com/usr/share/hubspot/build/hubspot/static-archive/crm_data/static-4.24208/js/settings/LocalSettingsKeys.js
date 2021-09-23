'use es6';

import PortalIdParser from 'PortalIdParser';

var _portalId = PortalIdParser.get();

export var DEFAULT_PIPELINE_ID = "defaultPipelineId:" + _portalId;
export var DEFAULT_TICKET_PIPELINE_ID = "defaultTicketPipelineId:" + _portalId;
export var POST_IMPORT_VIDEO_VISIBILITY = "postImportVideoVisibility:" + _portalId;
export var SEGMENTS_FOLDERS_LAST_VIEWED = "segmentsFoldersLastViewed:" + _portalId;
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}