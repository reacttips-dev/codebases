import { __ } from 'services/localization-service';
import styles from './footer.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'common/footer';

    _renderIssueReportLink = () => {
      return (
        <a
          href={__('https://udacity.zendesk.com/hc/en-us/requests/new')}
          target="_blank"
          styleName="footer-link"
        >
          {__('Report An Issue')}
        </a>
      );
    };

    render() {
      return (
        <div styleName="footer">
          <ul styleName="footer-text">
            <li>
              <a
                href={__('https://udacity.zendesk.com')}
                styleName="footer-link"
                target="_blank"
              >
                {__('Help & FAQ')}
              </a>
            </li>
            <li>{this._renderIssueReportLink()}</li>
          </ul>
        </div>
      );
    }
  },
  styles
);
