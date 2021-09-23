'use es6';

import { Map as ImmutableMap } from 'immutable';
import { useStoreDependency } from 'general-store';
import PropTypes from 'prop-types';
import ViewsStore from '../../crm_ui/flux/views/ViewsStore';
import { useViews } from '../../rewrite/views/hooks/useViews';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
export var viewsDependency = {
  propTypes: {
    objectType: PropTypes.string.isRequired
  },
  stores: [ViewsStore],
  deref: function deref(props) {
    var objectType = props.objectType;
    return ViewsStore.get(ImmutableMap({
      objectType: objectType
    }));
  }
};
export var useConditionalViews = function useConditionalViews(_ref) {
  var objectType = _ref.objectType;
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useViews();
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency(viewsDependency, {
    objectType: objectType
  });
};