import Body from './_body';
import ClassroomPropTypes from 'components/prop-types';
import Layout from 'components/common/layout';
import { NavHeader } from './_header';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import RelativePathHelper from 'helpers/relative-path-helper';
import SemanticTypes from 'constants/semantic-types';
import { TabKeys } from './_lab-tabs';
import styles from './_wrapper.scss';

export default class LabsWrapper extends React.Component {
  static displayName = 'components/labs/_wrapper';

  static propTypes = {
    selectedTabId: PropTypes.oneOf(_.values(TabKeys)).isRequired,
    lab: ClassroomPropTypes.lab.isRequired,
    children: PropTypes.node,
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
    const { lab, children, selectedTabId } = this.props;

    return (
      <Layout
        documentTitle={NodeHelper.getTitle(lab)}
        navVariant="none"
        header={
          <div className={styles['header']}>
            <NavHeader
              selectedTabId={selectedTabId}
              title={NodeHelper.getTitle(lab)}
              partPath={this._getPartPath()}
              lab={lab}
            />
          </div>
        }
      >
        <Body lab={lab} selectedTabId={selectedTabId}>
          {children}
        </Body>
      </Layout>
    );
  }
}
