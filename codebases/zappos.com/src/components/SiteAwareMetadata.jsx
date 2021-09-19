import ExecutionEnv from 'exenv';
import PropTypes from 'prop-types';
import { Children } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import withSideEffect from 'react-side-effect';

import { ClientRouteOnlyAriaLive } from 'components/common/AriaLive';
import { firePageView } from 'actions/pageView';

// See https://github.com/kodyl/react-document-meta/blob/master/lib/index.js#L183
const ServerSideSiteAwareMetadata = ({ children }) => {
  const count = Children.count(children);
  return count === 1 ? (
    Children.only(children)
  ) : count ? (
    <div>{children}</div>
  ) : null;
};

/*
* DocumentMeta component which updates <head/> based on the redux store (see `meta` reducer)
*/
export const SiteAwareMetadata = ({ documentMeta, children }) => (
// This component only renders client side, so really you shouldn't be making changes here
  <>
    <DocumentMeta {...documentMeta}>{children}</DocumentMeta>
    {/* Reads the title out to screen readers when it changes */}
    { documentMeta?.title && <ClientRouteOnlyAriaLive>{documentMeta.title}</ClientRouteOnlyAriaLive> }
  </>
);

SiteAwareMetadata.propTypes = {
  documentMeta: PropTypes.object,
  reduxZfcMetadata: PropTypes.string
};

export function reducePropsToState(propsList) {
  const props = Object.assign({}, ...propsList);
  // all these props except loading come from `connect()` and are action creators or redux state
  const state = {
    firePageView: props.firePageView,
    pageInfo: props.pageInfo,
    loading: !!props.loading,
    documentMeta: props.documentMeta,
    zfcMetadata: props.zfcMetadata
  };
  return state;
}

export function handleStateChangeOnClient(state) {
  const { loading, pageInfo, firePageView, zfcMetadata } = state;
  if (loading === false && (pageInfo && pageInfo.needsToFire && pageInfo.routeUpdated)) {
    firePageView(pageInfo, zfcMetadata);
  }
}

export const SiteAwareMetadataWithSideEffect = ExecutionEnv.canUseDOM ? withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(SiteAwareMetadata) : ServerSideSiteAwareMetadata;

export function mapStateToProps(state) {
  const { documentMeta } = state.meta;

  return {
    documentMeta,
    zfcMetadata: state.meta.zfcMetadata,
    pageInfo: state.pageView
  };
}

SiteAwareMetadata.contextTypes = {
  marketplace: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { firePageView })(SiteAwareMetadataWithSideEffect);
