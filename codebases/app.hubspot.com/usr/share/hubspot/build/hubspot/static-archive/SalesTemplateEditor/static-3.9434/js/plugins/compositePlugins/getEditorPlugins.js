'use es6';

import { Map as ImmutableMap } from 'immutable';
import StripButtonsAndOverlaysPlugin from 'draft-plugins/plugins/StripButtonsAndOverlaysPlugin';
import GateContainer from 'SalesTemplateEditor/data/GateContainer';
import ScopesContainer from 'SalesTemplateEditor/data/ScopesContainer';
import getBodyPlugins from './getBodyPlugins';
import getSubjectPlugins from './getSubjectPlugins';
export default (function (key) {
  var readOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var gates = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var includeModalPlugins = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var scopes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  if (GateContainer.get() === null) {
    GateContainer.set(gates);
  }

  if (ScopesContainer.get() === null) {
    ScopesContainer.set(scopes);
  }

  var options = {
    includeModalPlugins: includeModalPlugins,
    includeVideoPlugin: Boolean(ScopesContainer.get()['one-to-one-video'])
  };
  var bodyPlugins = getBodyPlugins(options);
  var subjectPlugins = getSubjectPlugins(options);
  var editorPluginMap = ImmutableMap({
    bodyPlugins: bodyPlugins,
    subjectPlugins: subjectPlugins
  });
  var plugins = editorPluginMap.get(key);
  return readOnly ? StripButtonsAndOverlaysPlugin(plugins) : plugins;
});