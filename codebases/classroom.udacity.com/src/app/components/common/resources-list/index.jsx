import ClassroomPropTypes from 'components/prop-types';
import NodeHelper from 'helpers/node-helper';
import Section from './_section';
import { __ } from 'services/localization-service';
import styles from './index.scss';

function sectionTitle(node) {
  const type = NodeHelper.getSemanticTypeName(node);
  return __('<%= type %> Resources', { type: __(type) });
}

@cssModule(styles)
export default class ResourcesList extends React.Component {
  static displayName = 'common/resources-list';

  static propTypes = {
    node: ClassroomPropTypes.node,
    root: ClassroomPropTypes.node.isRequired,
  };

  _renderNodeResources() {
    const { node } = this.props;
    const nodeHasMaterials = !NodeHelper.isResourcesEmpty(
      _.get(node, 'resources')
    );
    if (nodeHasMaterials) {
      return (
        <Section
          lessonKey={_.get(node, 'key')}
          title={sectionTitle(node)}
          resources={node.resources}
        />
      );
    }
  }

  _renderRootResources() {
    const { root, node } = this.props;
    return (
      <Section
        lessonKey={_.get(node, 'key')}
        resources={_.get(root, 'resources') || undefined}
        showSupport
      />
    );
  }

  render() {
    return (
      <div
        styleName="resources-list"
        role="tabpanel"
        aria-labelledby="sidebar-resources-list"
      >
        {this._renderNodeResources()}
        {this._renderRootResources()}
      </div>
    );
  }
}
