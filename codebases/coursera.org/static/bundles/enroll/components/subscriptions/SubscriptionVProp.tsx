import React from 'react';

import SubscriptionVPropCDP from 'bundles/enroll/components/subscriptions/SubscriptionVPropCDP';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import SubscriptionVPropSDP from 'bundles/enroll/components/subscriptions//SubscriptionVPropSDP';
import SubscriptionVPropBulletPoints from 'bundles/enroll/components/subscriptions//SubscriptionVPropBulletPoints';
import 'css!./__styles__/SubscriptionVProp';

type Props = {
  s12nId: string;
  courseId: string | null;
};

class SubscriptionVProp extends React.Component<Props> {
  render() {
    const { s12nId, courseId } = this.props;

    return (
      <div className="rc-SubscriptionVProp">
        <div className="punch-line">
          {!courseId ? <SubscriptionVPropSDP /> : <SubscriptionVPropCDP s12nId={s12nId} courseId={courseId} />}
        </div>
        {<SubscriptionVPropBulletPoints />}
      </div>
    );
  }
}

export default SubscriptionVProp;
