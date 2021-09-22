import Naptime from 'bundles/naptimejs';
import React from 'react';
import _t from 'i18n!nls/enroll';
import ValuePropBulletPoint from 'bundles/enroll/components/common/ValuePropBulletPoint';

import 'css!./__styles__/SubscriptionVPropBulletPoints';

const getBulletPoints = () => [
  _t('Practice material, graded assignments, discussion forums and more'),
  _t('Certificates to share on your resume, Linkedin, or CV'),
  _t('24/7 customer support'),
  _t('Easy cancellation'),
];

class SubscriptionVPropBulletPoints extends React.Component {
  render() {
    const bullets = getBulletPoints();
    return (
      <ul className="rc-SubscriptionVPropBulletPoints nostyle">
        {/* eslint-disable react/no-array-index-key */}
        {bullets.map((bullet, index) => (
          <li key={`bullet_${index}`}>
            <ValuePropBulletPoint>
              <p className="body-1-text">{bullet}</p>
            </ValuePropBulletPoint>
          </li>
        ))}
        {/* eslint-enable react/no-array-index-key */}
      </ul>
    );
  }
}

export default Naptime.createContainer(() => ({}))(SubscriptionVPropBulletPoints);
