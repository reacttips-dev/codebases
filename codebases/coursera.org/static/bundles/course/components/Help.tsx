import React from 'react';

import Retracked from 'js/app/retracked';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import HoverableOverlayTrigger from 'bundles/course/components/HoverableOverlayTrigger';
import Icon from 'bundles/iconfont/Icon';
import isMobileApp from 'js/lib/isMobileApp';
import user from 'js/lib/user';
/* eslint-disable import/extensions */
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import helpcenter from 'js/lib/coursera.helpcenter';
/* eslint-enable import/extensions */
import _t from 'i18n!nls/alice';
import 'css!./__styles__/Help';

type Props = {
  style?: { [styleAttr: string]: string | number };
  isEnterprise?: boolean;
};

const Help = ({ style, isEnterprise }: Props) => {
  const tooltipId = 'help-tooltip';
  const tooltip = _t('Help Center');

  if (isMobileApp.get()) {
    return null;
  }
  const isAuthenticatedUser = user.isAuthenticatedUser();
  const link = isEnterprise
    ? helpcenter.getEnterpriseHelpLink(isAuthenticatedUser)
    : helpcenter.getNewHelpCenterHome(isAuthenticatedUser);

  return (
    <HoverableOverlayTrigger overlay={tooltip} tooltipId={tooltipId} placement="top">
      <TrackedA
        className="rc-Help link-button nostyle"
        trackingName="icon"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={_t('Help Center')}
        style={style || { minWidth: 0, bottom: 20, right: 20 }}
      >
        <div className="help-widget horizontal-box align-items-absolute-center">
          <Icon name="question-circle-o" />
        </div>
      </TrackedA>
    </HoverableOverlayTrigger>
  );
};

export default Retracked.createTrackedContainer<Props>(() => {
  return {
    namespace: { page: 'help' },
  };
})(Help);
