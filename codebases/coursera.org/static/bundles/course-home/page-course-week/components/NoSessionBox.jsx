import React from 'react';
import _t from 'i18n!nls/ondemand';

class NoSessionBox extends React.Component {
  render() {
    return (
      <div className="rc-NoSessionBox rc-EnrollBox cozy od-container card-rich-interaction">
        <div className="vertical-box align-items-absolute-center styleguide">
          <h4 className="color-primary-text no-sessions-available">
            {_t('There are no sessions available for this course.')}
          </h4>
          <p>{_t('Check back later for updates about upcoming sessions.')}</p>
        </div>
      </div>
    );
  }
}

export default NoSessionBox;
