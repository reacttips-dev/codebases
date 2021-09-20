import { Loading } from '@udacity/veritas-components';
import { __ } from 'services/localization-service';
import styles from './loading-screen.scss';

@cssModule(styles)
export default class LoadingScreen extends React.Component {
  render() {
    return (
      <div styleName="loading-screen">
        <p styleName="message">{__('Loading scripts')}</p>
        <Loading label={__('Loading')} />
      </div>
    );
  }
}
