'use es6';

import { OrderedSet } from 'immutable';
import memoize from 'transmute/memoize';
export var getPropertiesInTypeDef = memoize(function (definition) {
  var primaryDisplayLabelPropertyName = definition.primaryDisplayLabelPropertyName,
      createDatePropertyName = definition.createDatePropertyName,
      lastModifiedPropertyName = definition.lastModifiedPropertyName,
      secondaryDisplayLabelPropertyNames = definition.secondaryDisplayLabelPropertyNames,
      pipelineCloseDatePropertyName = definition.pipelineCloseDatePropertyName,
      pipelinePropertyName = definition.pipelinePropertyName,
      pipelineStagePropertyName = definition.pipelineStagePropertyName,
      pipelineTimeToClosePropertyName = definition.pipelineTimeToClosePropertyName,
      defaultSearchPropertyNames = definition.defaultSearchPropertyNames,
      requiredProperties = definition.requiredProperties;
  return OrderedSet([primaryDisplayLabelPropertyName, createDatePropertyName, lastModifiedPropertyName]).union(secondaryDisplayLabelPropertyNames).union(defaultSearchPropertyNames).union(requiredProperties).union([pipelineCloseDatePropertyName, pipelinePropertyName, pipelineStagePropertyName, pipelineTimeToClosePropertyName]).toList().filter(Boolean);
});