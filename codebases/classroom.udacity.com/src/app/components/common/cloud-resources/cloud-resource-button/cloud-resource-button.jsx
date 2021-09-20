import { IconNewtab } from '@udacity/veritas-icons';
import { Loading } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './cloud-resource-button.scss';
import { useMemo } from 'react';

export const CloudResourceButton = ({ isLoading, hasResource, onClick }) => {
  const title = useMemo(
    () =>
      hasResource
        ? __('Open AWS Gateway')
        : isLoading
        ? __('Launching AWS...')
        : __('Launch AWS Gateway'),
    [isLoading, hasResource]
  );
  const icon = useMemo(
    () =>
      isLoading ? (
        <span className={styles['loading-overwrite']}>
          <Loading size="sm" />
        </span>
      ) : (
        <IconNewtab size="sm" title={hasResource ? __('Open') : __('Launch')} />
      ),
    [isLoading, hasResource]
  );

  return (
    <button className={styles.resource} onClick={onClick}>
      <span>{title}</span> {icon}
    </button>
  );
};

CloudResourceButton.displayName =
  'common/cloud-resource-button/cloud-resource-button';
CloudResourceButton.propTypes = {
  onLaunchCloudService: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default CloudResourceButton;
