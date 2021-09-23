'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _toArray from "@babel/runtime/helpers/esm/toArray";
import { isScoped } from '../../../setup-object-embed/containers/ScopeOperators';
import DealPipelineStore from 'crm_data/deals/DealPipelineStore';
import { DEFAULT_PIPELINE_ID } from 'crm_data/settings/LocalSettingsKeys';
import ScopesContainer from '../../../setup-object-embed/containers/ScopesContainer';
import localSettings from '../../legacy/utils/localSettings';

var hasMultiplePipelinesAccess = function hasMultiplePipelinesAccess() {
  return isScoped(ScopesContainer.get(), 'crm-multiple-pipelines-deals');
};

var hasEcommPipelineAccess = function hasEcommPipelineAccess() {
  return isScoped(ScopesContainer.get(), 'ecomm-reports');
};

var isEcommPipeline = function isEcommPipeline(option) {
  return option.text === 'Ecommerce Pipeline';
};

var maybeLockPipeline = function maybeLockPipeline(option) {
  var locked = isEcommPipeline(option) ? !hasEcommPipelineAccess() : option.value !== 'default';
  return Object.assign({}, option, {
    locked: locked
  });
};
/**
 * When portal has no multi-pipeline access, disable everything
 * except for the default pipeline, "Sales Pipeline"
 */


var disableNonDefaultPipelines = function disableNonDefaultPipelines(options) {
  return options.map(function (opt) {
    if (opt.disabled === true || hasMultiplePipelinesAccess()) {
      return opt;
    }

    return maybeLockPipeline(opt);
  });
};

var orderByDisabled = function orderByDisabled(a, b) {
  if (a.locked && !b.locked) return 1;
  if (b.locked && !a.locked) return -1; // fall back to default prior sort order

  return 0;
};

export default {
  store: DealPipelineStore,
  getPipelines: function getPipelines() {
    return DealPipelineStore.get();
  },
  getDefaultPipeline: function getDefaultPipeline() {
    return localSettings.get(DEFAULT_PIPELINE_ID);
  },
  getPipelineSelectOptions: function getPipelineSelectOptions(options) {
    if (hasMultiplePipelinesAccess()) {
      return options;
    }

    var _options = _toArray(options),
        all = _options[0],
        rest = _options.slice(1);

    return [all].concat(_toConsumableArray(disableNonDefaultPipelines(rest).sort(orderByDisabled)));
  },
  savePipelineSettings: function savePipelineSettings(pipelineId) {
    var key = DEFAULT_PIPELINE_ID;

    if (pipelineId) {
      localSettings.set(key, pipelineId);
    } else {
      localSettings.unset(key);
    }
  }
};