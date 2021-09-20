import Layout from 'components/common/layout';
import { __ } from 'services/localization-service';

export default class extends React.Component {
  static displayName = 'loading';

  render() {
    return <Layout busy documentTitle={__('Loading')} />;
  }
}
