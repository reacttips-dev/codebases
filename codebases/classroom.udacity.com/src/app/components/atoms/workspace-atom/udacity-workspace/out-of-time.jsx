import { Loading } from '@udacity/veritas-components';
import React from 'react';
import { __ } from 'services/localization-service';
import styles from './out-of-time.scss';

@cssModule(styles)
export default class OutOfTime extends React.Component {
  render() {
    const iconType = 'gpu-out-of-time-icon';

    return (
      <div styleName="out-of-time-container">
        <div styleName="banner">
          <span styleName="icon-container">
            <span styleName={iconType} />
          </span>
        </div>
        <section styleName="title">{__('Your GPU time has run out.')}</section>
        <section styleName="text">
          {__(
            'Your workspace will now turn off GPU mode. Note all processes currently running will be terminated. Your work is being copied to a new workspace.'
          )}
        </section>
        <Loading label={__('Loading')} />
      </div>
    );
  }
}
