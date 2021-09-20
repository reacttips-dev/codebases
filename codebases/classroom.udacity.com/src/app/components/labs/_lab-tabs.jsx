import Tabs, { Tab } from 'components/common/tabs';

import ClassroomPropTypes from 'components/prop-types';
import { IconLocked } from '@udacity/veritas-icons';
import LabHelper from 'helpers/lab-helper';
import PropTypes from 'prop-types';
import { THEMES } from 'constants/theme';
import { __ } from 'services/localization-service';

export const TabKeys = {
  INSTRUCTIONS: 'instructions',
  OVERVIEW: 'overview',
  REFLECTION: 'reflection',
  WORKSPACE: 'workspace',
};

export const getLabTabPath = (labPath, tabName) => {
  const [lessonPath] = labPath.split('/lab');
  return `${lessonPath}/lab/${tabName}`;
};

export default class LabTabs extends React.Component {
  static displayName = 'labs/_lab-tabs';

  static propTypes = {
    selectedTabId: PropTypes.oneOf(_.values(TabKeys)).isRequired,
    lab: ClassroomPropTypes.lab.isRequired,
  };

  static contextTypes = {
    location: PropTypes.object.isRequired,
  };

  _getReviewTitle() {
    const { lab } = this.props;
    return (
      <span>
        {LabHelper.isPassed(lab) ? null : (
          <IconLocked size="sm" title={__('Locked')} />
        )}
        {__('Reflection')}
      </span>
    );
  }

  render() {
    const { selectedTabId } = this.props;
    const {
      location: { pathname: labPath },
    } = this.context;
    // TODO: (dcwither) use withRoutes for the tabPath
    return (
      <Tabs selectedTabId={selectedTabId} theme={THEMES.DARK}>
        <Tab
          id={TabKeys.OVERVIEW}
          path={getLabTabPath(labPath, TabKeys.OVERVIEW)}
        >
          {__('Introduction')}
        </Tab>
        <Tab
          id={TabKeys.INSTRUCTIONS}
          path={getLabTabPath(labPath, TabKeys.INSTRUCTIONS)}
        >
          {__('Instructions')}
        </Tab>
        <Tab
          id={TabKeys.WORKSPACE}
          path={getLabTabPath(labPath, TabKeys.WORKSPACE)}
        >
          {__('Workspace')}
        </Tab>
        <Tab
          id={TabKeys.REFLECTION}
          path={getLabTabPath(labPath, TabKeys.REFLECTION)}
        >
          {this._getReviewTitle()}
        </Tab>
      </Tabs>
    );
  }
}
