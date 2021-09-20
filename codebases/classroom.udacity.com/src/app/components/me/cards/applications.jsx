import AdmissionsHelper from 'helpers/admissions-helper';
import { Button } from '@udacity/veritas-components';
import Card from './card';
import { IconArrowRight } from '@udacity/veritas-icons';
import styles from './card-footer.scss';

@cssModule(styles)
export default class Applications extends React.Component {
  static displayName = 'me/cards/applicaitons';

  _renderButton = (handleClick, props) => {
    const { application } = props;
    const hasButton =
      AdmissionsHelper.hasAdmissionsDecision(application) ||
      AdmissionsHelper.canViewApplication(application);

    return hasButton ? (
      <Button
        label={AdmissionsHelper.getButtonText(application.status)}
        variant="primary"
        iconRight={<IconArrowRight />}
        href={AdmissionsHelper.getRedirectUrl(application)}
        external={true}
      />
    ) : null;
  };

  _renderFooter = (props) => {
    const { application } = props;
    const completionString = AdmissionsHelper.getCompletionString(application);

    return (
      completionString && (
        <div className={styles['footer']}>{completionString}</div>
      )
    );
  };

  render() {
    const { applications } = this.props;

    return (
      <ol>
        {_.map(applications, (application) => {
          const { degree_id, cohort_id, degree } = application;

          return (
            <Card
              key={degree_id + cohort_id}
              title={degree.title}
              type="Application"
              isGraduated={false}
              showColorScheme={false}
              renderButton={this._renderButton}
              renderFooter={this._renderFooter}
              application={application}
              path={AdmissionsHelper.getRedirectUrl(application)}
            />
          );
        })}
      </ol>
    );
  }
}
