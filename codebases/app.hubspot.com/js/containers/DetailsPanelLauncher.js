'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import PropTypes from 'prop-types';
import PostDetailsPanelContainer from '../posts/PostDetailsPanelContainer';
import { connect } from 'react-redux';
import { getPostByKeyString } from '../posts/selectors';
import { updatePostsCampaign } from '../posts/actions';
var AsyncBroadcastDetailsPanelContainer = Loadable({
  loader: function loader() {
    return import('./BroadcastDetailsPanelContainer'
    /* webpackChunkName: "BroadcastDetailsPanelContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var mapDispatchToProps = {
  updatePostsCampaign: updatePostsCampaign
};

var DetailsPanelLauncher = function DetailsPanelLauncher(props) {
  var broadcastGuid = props.params.id || props.location.query.broadcast;
  var postKeyString = props.location.query.post;

  if (!broadcastGuid && !postKeyString) {
    return null;
  }

  if (broadcastGuid) {
    props.params.id = broadcastGuid;
    return /*#__PURE__*/_jsx(AsyncBroadcastDetailsPanelContainer, {
      location: props.location,
      params: props.params
    });
  } else {
    return /*#__PURE__*/_jsx(PostDetailsPanelContainer, {
      getPostForDisplay: getPostByKeyString,
      location: props.location,
      params: props.params,
      postKeyString: postKeyString,
      updatePostsCampaign: props.updatePostsCampaign
    });
  }
};

DetailsPanelLauncher.propTypes = {
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
};
export default connect(null, mapDispatchToProps)(DetailsPanelLauncher);