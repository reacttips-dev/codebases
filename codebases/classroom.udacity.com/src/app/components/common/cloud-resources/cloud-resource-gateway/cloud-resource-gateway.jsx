import {
  Button,
  Loading,
  Space,
  TextArea,
  TextInput,
} from '@udacity/veritas-components';
import { IconLink } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from 'services/localization-service';
import styles from './cloud-resource-gateway.module.scss';

export const CloudResourceGateway = ({ resource }) =>
  resource ? (
    <div>
      <Metadata
        inputId="aws-access-key-id"
        title="AWS Access Key ID"
        value={resource.aws_access_key_id}
      />

      <Metadata
        inputId="aws-secret-access-key"
        title="AWS Secret Access Key"
        value={resource.aws_secret_access_key}
      />

      <Metadata
        inputId="aws-session-token"
        title="AWS Session Token"
        value={resource.aws_session_token}
      />

      <Button
        label={__('Open AWS Console')}
        icon={<IconLink />}
        href={resource.url}
        external
        full
        variant="primary"
      />
    </div>
  ) : (
    <Loading busy>
      <div className={styles['loading-space']} />
    </Loading>
  );

CloudResourceGateway.displayName =
  'common/cloud-resources/cloud-resource-gateway';
CloudResourceGateway.propTypes = {
  resource: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default CloudResourceGateway;

const SINGLE_LINE_LENGTH = 50;

const Metadata = ({ inputId, title, value }) => (
  <Space type="stack" size="3x">
    {value.length < SINGLE_LINE_LENGTH ? (
      <TextInput
        id={inputId}
        label={title}
        value={value}
        onChange={() => {}}
        readOnly
        required
      />
    ) : (
      <TextArea
        id={inputId}
        label={title}
        value={value}
        onChange={() => {}}
        readOnly
        required
      />
    )}
  </Space>
);
