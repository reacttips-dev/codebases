import { TabKeys, getLabTabPath } from './_lab-tabs';
import ClassroomPropTypes from 'components/prop-types';
import LabHelper from 'helpers/lab-helper';
import LabStatus from '@udacity/ureact-workspace/src/workspace/blueprints/lab-status';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PropTypes from 'prop-types';
import WorkspaceAtom from '../atoms/workspace-atom';
import Wrapper from './_wrapper';
import styles from './workspace.scss';

@cssModule(styles)
export default class LabWorkspace extends React.Component {
  static displayName = 'components/labs/workspace';

  static propTypes = {
    lab: ClassroomPropTypes.lab.isRequired,
    onLabUpdated: PropTypes.func.isRequired,
    fetchLab: PropTypes.func.isRequired,
    trackLabActivity: PropTypes.func.isRequired,
  };

  static contextTypes = {
    location: PropTypes.object.isRequired,
    root: ClassroomPropTypes.node.isRequired,
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.trackLabActivity('lab_started');
  }

  handleSuccess = () => {
    const { router, location } = this.context;
    router.push(getLabTabPath(location.pathname, TabKeys.REFLECTION));
  };

  handleSubmit = (result, summary) => {
    const { fetchLab, lab, trackLabActivity } = this.props;

    if (result === LabStatus.GRADED) {
      // When the student passes, the review_video is able to be resolved by classroom-content
      // and needs to be retrieved
      fetchLab(lab.id);
    } else {
      //result is PASSED || FAILED
      trackLabActivity('lab_submitted', {
        lab_result: result,
        lab_result_summary: summary,
      });
    }
  };

  render() {
    const { lab, trackLabActivity } = this.props;
    const { root } = this.context;
    const workspaceAtom = _.get(lab, 'workspace', {});
    const isPassedLab = LabHelper.isPassed(lab);

    return (
      <Wrapper selectedTabId={TabKeys.WORKSPACE} lab={lab}>
        <div
          styleName={
            NanodegreeHelper.isStatic(root)
              ? 'static-workspace-container'
              : 'workspace-container'
          }
        >
          {workspaceAtom ? (
            <WorkspaceAtom
              isWideLayout={true}
              atom={{ ...workspaceAtom, enableGrading: true }}
              onSubmit={this.handleSubmit}
              onSuccess={this.handleSuccess}
              isPassedLab={isPassedLab}
              trackLabActivity={trackLabActivity}
            />
          ) : null}
        </div>
      </Wrapper>
    );
  }
}
