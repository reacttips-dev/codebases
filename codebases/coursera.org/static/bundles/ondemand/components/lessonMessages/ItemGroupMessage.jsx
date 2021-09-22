import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'bundles/iconfont/Icon';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import { CORE_TRACK, HONORS_TRACK } from 'pages/open-course/common/models/tracks';
import _t from 'i18n!nls/ondemand';
import HonorsTooltipTrigger from './HonorsTooltipTrigger';
import 'css!./__styles__/ItemGroupMessage';

const CoreItemGroupMessage = ({ passedChoicesCount, requiredPassedCount, choicesCount }) => (
  <div className="horizontal-box align-items-vertical-center">
    <Icon name="info" size="lg" className="od-item-group-message-icon" />
    {passedChoicesCount === 0 && (
      <strong>
        <FormattedHTMLMessage
          message={_t('Complete {requiredPassedCount} out of {choicesCount}')}
          requiredPassedCount={requiredPassedCount}
          choicesCount={choicesCount}
        />
      </strong>
    )}
    {passedChoicesCount !== 0 && (
      <strong>
        <FormattedHTMLMessage
          message={_t('Complete {morePassCount} more')}
          morePassCount={requiredPassedCount - passedChoicesCount}
        />
      </strong>
    )}
  </div>
);

const HonorsItemGroupMessage = ({ passedChoicesCount, requiredPassedCount, choicesCount }) => (
  <div className="horizontal-box align-items-vertical-center">
    <Icon name="honors" size="lg" className="od-item-group-message-icon" />
    {passedChoicesCount === 0 && (
      <FormattedHTMLMessage
        message={_t('<strong>Complete {requiredPassedCount} out of {choicesCount}</strong> to get Honors recognition')}
        requiredPassedCount={requiredPassedCount}
        choicesCount={choicesCount}
      />
    )}
    {passedChoicesCount !== 0 && (
      <FormattedHTMLMessage
        message={_t('<strong>Complete {morePassCount} more</strong> to get Honors recognition')}
        morePassCount={requiredPassedCount - passedChoicesCount}
      />
    )}
    <HonorsTooltipTrigger />
  </div>
);

const PassedItemGroupMessage = () => (
  <div className="horizontal-box align-items-vertical-center">
    <Icon name="check-circle" size="lg" className="od-item-group-message-icon" />
    <div className="body-2-text">{_t('You have completed this section')}</div>
  </div>
);

class ItemGroupMessage extends React.Component {
  static propTypes = {
    passedChoicesCount: PropTypes.number.isRequired,
    isItemGroupPassed: PropTypes.bool.isRequired,
    requiredPassedCount: PropTypes.number.isRequired,
    choicesCount: PropTypes.number.isRequired,
    trackId: PropTypes.oneOf([CORE_TRACK, HONORS_TRACK]).isRequired,
  };

  render() {
    const { passedChoicesCount, isItemGroupPassed, requiredPassedCount, choicesCount, trackId } = this.props;
    return (
      <div className="rc-ItemGroupMessage horizontal-box align-items-vertical-center">
        {trackId === CORE_TRACK && isItemGroupPassed && <PassedItemGroupMessage />}
        {trackId === CORE_TRACK && !isItemGroupPassed && (
          <CoreItemGroupMessage
            passedChoicesCount={passedChoicesCount}
            requiredPassedCount={requiredPassedCount}
            choicesCount={choicesCount}
          />
        )}
        {trackId === HONORS_TRACK && isItemGroupPassed && <PassedItemGroupMessage />}
        {trackId === HONORS_TRACK && !isItemGroupPassed && (
          <HonorsItemGroupMessage
            passedChoicesCount={passedChoicesCount}
            requiredPassedCount={requiredPassedCount}
            choicesCount={choicesCount}
          />
        )}
      </div>
    );
  }
}

export default ItemGroupMessage;
