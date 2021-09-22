import React from 'react';
import _ from 'lodash';
import connectToStores from 'js/lib/connectToStores';
import _t from 'i18n!nls/common';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import { Notification } from '@coursera/coursera-ui';
import ApplicationStoreClass from 'bundles/ssr/stores/ApplicationStore';
import UserAgentInfo from 'js/lib/useragent';

type Props = {
  isProject: boolean;
  userAgent: UserAgentInfo;
  rootClassName: string | undefined;
};

const IENotificationForGuidedProject = (props: Props) => {
  const { userAgent, isProject, rootClassName } = props;
  const isIE = userAgent.browser.name === 'IE';
  const shouldRender = isProject && isIE;

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={rootClassName}>
      <Notification
        message={
          <FormattedHTMLMessage
            message={_t(
              'Guided Projects are not supported in <b>Internet Explorer</b>. You will need to use a modern browser.'
            )}
          />
        }
        type="error"
      />
    </div>
  );
};

export const BaseComponent = IENotificationForGuidedProject;

export default _.flowRight(
  connectToStores<Props, Omit<Props, 'userAgent'>, ApplicationStoreClass>(
    [ApplicationStoreClass],
    (ApplicationStore, props) => ({
      ...props,
      userAgent: ApplicationStore.getUserAgent(),
    })
  )
)(IENotificationForGuidedProject);
