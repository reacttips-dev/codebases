import ButtonLink from 'components/common/button-link';
import ClassroomPropTypes from 'components/prop-types';
import PropTypes from 'prop-types';
import RelativePathHelper from 'helpers/relative-path-helper';
import Responsive from 'components/common/responsive';
import Section from './_section';
import SemanticTypes from 'constants/semantic-types';
import { THEMES } from 'constants/theme';
import { TabKeys } from './_lab-tabs';
import { TabsHeader } from './_header';
import { __ } from 'services/localization-service';
import styles from './_body.scss';

@cssModule(styles)
export default class LabsWrapperBody extends React.Component {
  static displayName = 'components/labs/_body';

  static propTypes = {
    children: PropTypes.node,
    selectedTabId: PropTypes.oneOf(_.values(TabKeys)).isRequired,
    lab: ClassroomPropTypes.lab.isRequired,
  };

  static contextTypes = {
    location: PropTypes.object,
  };

  _getPartPath() {
    const { location } = this.context;
    return RelativePathHelper.getPathForSemanticType(
      location.pathname,
      SemanticTypes.PART
    );
  }

  render() {
    const { selectedTabId, lab, children } = this.props;

    return (
      <div>
        <Responsive block type="until-tablet" styleName="screen-width-warning">
          <Section
            theme={THEMES.DARK}
            title={__(
              'Labs can only be completed on a desktop or laptop and not on tablets or mobile devices. Sorry for the inconvenience.'
            )}
          >
            <ButtonLink
              label={__('Return to Lessons')}
              to={this._getPartPath()}
              variant="primary"
            />
          </Section>
        </Responsive>
        <Responsive block type="from-tablet" styleName="body">
          {selectedTabId === TabKeys.WORKSPACE ? null : (
            <TabsHeader lab={lab} />
          )}
          {children}
        </Responsive>
      </div>
    );
  }
}
