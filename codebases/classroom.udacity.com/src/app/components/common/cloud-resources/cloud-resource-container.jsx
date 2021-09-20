import React, { useCallback, useMemo, useState } from 'react';
import Actions from 'actions';
import CloudResourceButton from './cloud-resource-button';
import CloudResourceGateway from './cloud-resource-gateway';
import { Modal } from '@udacity/veritas-components';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import { getEnrollmentRecord } from 'helpers/state-helper/_enrollments-state-helper';
import moment from 'moment';

const mapDispatchToProps = {
  launchCloudResource: Actions.launchCloudResource,
};

const mapStateToProps = (state, { nanodegree: { key } }) => ({
  gatewayResource: NanodegreeHelper.State.getLaunchedCloudResource(state, key),
  cloudResourcesServiceId: NanodegreeHelper.State.getCloudResourcesServiceId(
    state,
    key
  ),
  isLoading: NanodegreeHelper.State.isLaunchingCloudResource(state, key),
  enrollment: getEnrollmentRecord(state, key),
});

export function CloudResourceContainer({
  cloudResourcesServiceId,
  enrollment,
  gatewayResource,
  isLoading,
  launchCloudResource,
  nanodegree,
}) {
  const [gatewayOpen, setGatewayOpen] = useState(false);

  const isGatewayResourceExpired = useMemo(
    () => !!gatewayResource && moment().isAfter(gatewayResource.session_end),
    [gatewayResource]
  );

  const handleButtonClick = useCallback(async () => {
    const { id: enrollmentId } = enrollment || {};
    const { id: ndId, key } = nanodegree;
    setGatewayOpen(true);

    if (
      (isGatewayResourceExpired || !gatewayResource) &&
      !isLoading &&
      !!cloudResourcesServiceId
    ) {
      launchCloudResource({
        serviceId: cloudResourcesServiceId,
        ndId,
        enrollmentId,
        ndKey: key,
      });
    }
  }, [
    cloudResourcesServiceId,
    enrollment,
    gatewayResource,
    isGatewayResourceExpired,
    isLoading,
    launchCloudResource,
    nanodegree,
  ]);

  return cloudResourcesServiceId ? (
    <React.Fragment>
      <CloudResourceButton
        isLoading={isLoading}
        hasResource={gatewayResource && !isGatewayResourceExpired}
        onClick={handleButtonClick}
      />
      <Modal
        label={__('Cloud resource gateway')}
        open={gatewayOpen}
        onClose={() => setGatewayOpen(false)}
      >
        <CloudResourceGateway
          isLoading={isLoading}
          resource={gatewayResource}
        />
      </Modal>
    </React.Fragment>
  ) : null;
}

CloudResourceContainer.displayName =
  'common/cloud-resources/cloud-resource-container';

CloudResourceContainer.propTypes = {
  cloudResourcesServiceId: PropTypes.string,
  enrollment: PropTypes.object,
  gatewayResource: PropTypes.object,
  isLoading: PropTypes.bool,
  launchCloudResource: PropTypes.func,
  nanodegree: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CloudResourceContainer);
