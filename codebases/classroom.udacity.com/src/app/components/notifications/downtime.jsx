import { __ } from 'services/localization-service';
import styles from './downtime.scss';

export default cssModule(function DowntimeNotification() {
  return (
    <div>
      <span styleName="text">
        {__(
          'An error originating with YouTube currently means subtitles are not available in our embedded player. We are working with YouTube to resolve as fast as possible. In the meantime, you can view videos with subtitles via the YouTube website. See our <a target="_blank" href="http://status.udacity.com/">status page</a> for updates. -Udacity Tech Support',
          { renderHTML: true }
        )}
      </span>
    </div>
  );
}, styles);
