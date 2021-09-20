import { CheckpointInfoHeader } from 'components/common/overview-header';
import ClassroomPropTypes from 'components/prop-types';
import DeadlineBar from 'components/common/deadline-bar';
import GraduationButton from 'components/common/graduation-button';
import IconCertificate from 'images/icons/certificate.svg';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';

export default class GraduationInfo extends React.Component {
  static displayName = 'common/overview-header/_graduation-info';

  static propTypes = {
    nanodegree: ClassroomPropTypes.nanodegree,
    isHeaderCollapsed: PropTypes.bool,
  };

  static contextTypes = {
    projects: PropTypes.arrayOf(ClassroomPropTypes.project),
  };

  _renderDeadlineBar(text) {
    return <DeadlineBar text={text} projects={this.context.projects} />;
  }

  render() {
    const { isHeaderCollapsed, nanodegree } = this.props;
    const button = <GraduationButton ndKey={nanodegree.key} />;

    if (!nanodegree.is_graduated) {
      return (
        <CheckpointInfoHeader
          icon="certificate-xl"
          button={button}
          title={__('Congratulations! You are ready to graduate.')}
          deadlineBar={this._renderDeadlineBar(
            __('You have completed all required coursework!')
          )}
          isHeaderCollapsed={isHeaderCollapsed}
          nanodegree={nanodegree}
        />
      );
    } else {
      return (
        <CheckpointInfoHeader
          icon={IconCertificate}
          title={__('Congratulations, you have graduated from <%= ndTitle %>', {
            ndTitle: NanodegreeHelper.getNanodegreeTitle(nanodegree),
          })}
          deadlineBar={this._renderDeadlineBar(
            __('You have completed all required coursework and graduated')
          )}
          isHeaderCollapsed={isHeaderCollapsed}
          nanodegree={nanodegree}
        />
      );
    }
  }
}
