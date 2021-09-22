import Q from 'q';
import React from 'react';
import classNames from 'classnames';
import { ButtonSize, ButtonType } from '@coursera/coursera-ui';
import { TrackedApiButton } from 'bundles/common/components/withSingleTracked';
import {
  API_BEFORE_SEND,
  API_IN_PROGRESS,
  API_ERROR,
  API_SUCCESS,
} from '@coursera/coursera-ui/lib/constants/sharedConstants';
import WorkspaceLauncher from 'bundles/item-workspace/components/WorkspaceLauncher';
import _t from 'i18n!nls/programming';
import 'css!./__styles__/WorkspaceButton';

type PropsToComponent = {
  className?: string;
  getLaunchUrl: () => Q.Promise<string>;
  appName?: string;
  resetApiStatusDelay?: number;
  label?: string;
  icon?: React.ReactNode;
  type?: ButtonType;
  size?: ButtonSize;
  trackingName?: string;
};

const WorkspaceButton: React.FC<PropsToComponent> = ({
  className,
  getLaunchUrl,
  resetApiStatusDelay,
  appName,
  label,
  icon,
  type,
  size,
  // This is just a default. Users of this component are encouraged to define their own value that
  // is more specific to their use case, e.g. "ungraded_lab_launch_button".
  trackingName = 'workspace_launch_button',
}) => {
  return (
    <div className={classNames('rc-WorkspaceButton', className)}>
      <WorkspaceLauncher
        getLaunchUrl={getLaunchUrl}
        resetApiStatusDelay={resetApiStatusDelay}
        render={({ apiStatus, onClick }) => (
          <TrackedApiButton
            type={type}
            onClick={onClick}
            apiStatus={apiStatus}
            size={size}
            trackingName={trackingName}
            apiStatusAttributesConfig={{
              label: {
                [API_BEFORE_SEND]: (
                  <span className="button-label">
                    {label || (appName ? _t(`Open #{appName}`, { appName }) : _t('Open'))}
                  </span>
                ),
                [API_IN_PROGRESS]: _t('Opening...'),
                [API_SUCCESS]: appName ? _t(`Opened #{appName}`, { appName }) : _t('Opened'),
                [API_ERROR]: appName ? _t(`Error opening #{appName}`, { appName }) : _t('Error'),
              },
            }}
          >
            {icon}
          </TrackedApiButton>
        )}
      />
    </div>
  );
};

export default WorkspaceButton;
