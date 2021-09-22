import React from 'react';
import a11yKeyPress from 'js/lib/a11yKeyPress';

// TODO: Get rid of dependency on teach-course.
import ToggleSwitch from 'bundles/teach-course/components/ToggleSwitch';

import _t from 'i18n!nls/course-home';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import 'css!./__styles__/EmailSubscription';

type Props = {
  status: 'subscribed' | 'unsubscribed';
  partnerName: string;
  onDismiss: () => void;
  onUpdate: (x: boolean) => void;
};

class EmailSubscription extends React.Component<Props> {
  render() {
    const { status, partnerName, onDismiss, onUpdate } = this.props;
    const isSubscribed = status === 'subscribed';

    return (
      <div className="rc-EmailSubscription">
        <div className="partner-banner-content horizontal-box align-items-vertical-center">
          <p className="partner-subscription-text flex-1">
            <FormattedHTMLMessage
              message={_t('Do you want to receive emails from <strong>{partnerName}</strong>?')}
              partnerName={partnerName}
            />
          </p>

          <ToggleSwitch
            ariaLabel={_t('Do you want to receive emails from #{partnerName}?', { partnerName })}
            onToggle={(toggleStatus) => {
              onUpdate(toggleStatus === ToggleSwitch.getStatus().On);
            }}
            defaultStatus={isSubscribed ? ToggleSwitch.getStatus().On : ToggleSwitch.getStatus().Off}
          />

          <i
            tabIndex={0}
            role="button"
            onClick={onDismiss}
            aria-label={_t('Dismiss emails signup note')}
            className="cif-close dismiss"
            onKeyPress={(event) => a11yKeyPress(event, onDismiss)}
          />
        </div>
      </div>
    );
  }
}

export default EmailSubscription;
