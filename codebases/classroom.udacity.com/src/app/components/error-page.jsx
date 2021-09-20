import InternalError from 'components/common/internal-error';
import { trackInitialPageLoad } from 'helpers/performance-helper';

export default class ErrorPage extends React.Component {
  static displayName = 'error';

  componentDidMount() {
    trackInitialPageLoad('nodeNotFound');
  }

  render() {
    return <InternalError />;
  }
}
