import { __ } from 'services/localization-service';
import styles from './_billing-header.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'settings/setting-billing/_billing-header';

    render() {
      return (
        <div>
          <h1 styleName="header-text">{__('Billing Information')}</h1>
        </div>
      );
    }
  },
  styles
);
