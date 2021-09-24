'use es6';

import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import get from 'transmute/get';
export var format = function format(stage, _pipelineId, _pipelineLabel) {
  var defaultTicketPipeline = '0';
  var defaultDealPipeline = 'default';

  var pipelineId = _pipelineId || get('pipelineId', stage);

  var pipelineLabel = _pipelineLabel || get('pipelineLabel', stage);

  var text = get('text', stage);
  var textTranslated = [defaultTicketPipeline, defaultDealPipeline].includes(pipelineId) ? propertyLabelTranslator(text) : text;
  return pipelineLabel ? textTranslated + " (" + pipelineLabel + ")" : textTranslated;
};