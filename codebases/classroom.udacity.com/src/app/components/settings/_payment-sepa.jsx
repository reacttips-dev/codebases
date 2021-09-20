import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_payment-sepa.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'settings/setting-billing/_payment-sepa';

    static propTypes = {
      source: PropTypes.shape({
        id: PropTypes.string,
        currency: PropTypes.string,
        object: PropTypes.string,
        type: PropTypes.string,
        owner: PropTypes.shape({
          address: PropTypes.object,
          email: PropTypes.string,
        }),
        source_details: PropTypes.shape({
          last4: PropTypes.number,
          country: PropTypes.string,
          fingerprint: PropTypes.string,
          mandate_reference: PropTypes.string,
          mandate_url: PropTypes.string,
        }),
      }),
      id: PropTypes.string,
    };

    static defaultProps = {
      source: {},
    };

    render() {
      var { source } = this.props;

      var first2 = source.source_details.last4.toString().slice(0, 2);
      var last2 = source.source_details.last4.toString().slice(2);

      return (
        <div>
          <div styleName="cc-container">
            <div styleName="cc-info">
              <div>{source.owner.name}</div>
              <div>
                {source.source_details.country}•• •••• •••• •••• ••{first2}{' '}
                {last2}
              </div>
              <a
                href={source.source_details.mandate_url}
                target="_blank"
                styleName="link"
              >
                {__('View SEPA Mandate')}
              </a>
            </div>
            <div styleName="cc-icon">
              <div styleName="bank-icon" />
            </div>
          </div>
        </div>
      );
    }
  },
  styles
);
