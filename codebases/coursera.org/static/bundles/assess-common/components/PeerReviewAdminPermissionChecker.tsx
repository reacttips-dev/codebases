import PropTypes from 'prop-types';
import React from 'react';
import Naptime from 'bundles/naptimejs';
import mapProps from 'js/lib/mapProps';
import { compose } from 'recompose';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import setupFluxibleApp from 'js/lib/setupFluxibleApp';
import ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import CourseMembershipStore from 'bundles/ondemand/stores/CourseMembershipStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { loadMembership } from 'bundles/ondemand/actions/CourseMembershipActions';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import privilegedAuths from 'bundles/naptimejs/resources/privilegedAuths.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import isPeerReviewAdminAuthorized from 'pages/open-course/common/utils/isPeerReviewAdminAuthorized';

import { FluxibleContext } from 'fluxible';

type PropsFromCaller = {
  requestedCapability?: string;
  children?: JSX.Element | null;
};

type Props = PropsFromCaller & {
  hasPermission?: boolean;
};

const PeerReviewAdminPermissionChecker: React.FC<Props> = ({ hasPermission, children }) => {
  if (!hasPermission) {
    return null;
  }
  return children || null;
};

type PropsFromStores = PropsFromCaller & {
  courseRole: string;
};

type PropsFromNaptime = PropsFromStores & {
  privilegedAuths: privilegedAuths;
};

const PeerReviewAdminPermissionCheckerWithData = compose<Props, PropsFromCaller>(
  connectToStores<PropsFromCaller, PropsFromStores>(['CourseMembershipStore'], ({ CourseMembershipStore }) => ({
    courseRole: CourseMembershipStore.getCourseRole(),
  })),
  Naptime.createContainer<PropsFromNaptime, PropsFromStores>(() => ({
    privilegedAuths: privilegedAuths.finder('me', {
      fields: ['outsourcingPermissions'],
      required: false,
    }),
  })),
  mapProps<Props, PropsFromNaptime>((props) => {
    const isOutsourcingOrSuperuser =
      props.privilegedAuths && !!props.privilegedAuths[0] && !!props.privilegedAuths[0].outsourcingPermissions;

    return {
      ...props,
      hasPermission: isPeerReviewAdminAuthorized(props.courseRole, isOutsourcingOrSuperuser, props.requestedCapability),
    };
  })
)(PeerReviewAdminPermissionChecker);

const setupApp = (fluxibleContext: FluxibleContext) =>
  setupFluxibleApp(fluxibleContext, (app: $TSFixMe /* TODO: type setupFluxibleApp */) => {
    app.registerStore(ApplicationStore);
    app.registerStore(NaptimeStore);
    app.registerStore(CourseMembershipStore);

    return fluxibleContext;
  });

export default class FluxifiedPeerReviewAdminPermissionChecker extends React.Component<PropsFromCaller> {
  fluxibleContext: FluxibleContext;

  static contextTypes = {
    fluxibleContext: PropTypes.object,
  };

  constructor(props: PropsFromCaller, context: { fluxibleContext: FluxibleContext }) {
    super(props, context);
    this.fluxibleContext = setupApp(context.fluxibleContext);
  }

  componentWillMount() {
    // @ts-expect-error TODO: FluxibleContext does not seem to have executeAction method. Need to investigate
    this.fluxibleContext.executeAction(loadMembership);
  }

  render() {
    return (
      <FluxibleComponent context={this.fluxibleContext.getComponentContext()}>
        <PeerReviewAdminPermissionCheckerWithData {...this.props} />
      </FluxibleComponent>
    );
  }
}
