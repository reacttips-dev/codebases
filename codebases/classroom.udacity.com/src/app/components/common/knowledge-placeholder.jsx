import ClassroomPropTypes from 'components/prop-types';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import SettingsHelper from 'helpers/settings-helper';
import { connect } from 'react-redux';
import { getContext } from 'recompose';

const mapStateToProps = (state, ownProps) => {
  const ndKey = _.get(ownProps, 'root.key');
  return {
    isKnowledgeEnabled: SettingsHelper.State.getHasKnowledgeReviews(
      state,
      ndKey
    ),
  };
};

// accepts only exactly one child
export const KnowledgePlaceholder = ({
  root,
  children,
  placeholder,
  isKnowledgeEnabled,
}) => {
  return SemanticTypes.isNanodegree(root) && isKnowledgeEnabled
    ? children
    : placeholder;
};

KnowledgePlaceholder.propTypes = {
  isKnowledgeEnabled: PropTypes.bool,
  root: ClassroomPropTypes.node.isRequired,
  children: PropTypes.node,
  placeholder: PropTypes.node,
};

KnowledgePlaceholder.defaultProps = {
  children: null,
  placeholder: null,
};

KnowledgePlaceholder.displayName = 'common/knowledge-content-placeholder';

const ConnectedKnowledgePlaceholder = connect(mapStateToProps)(
  KnowledgePlaceholder
);

export default getContext({
  root: ClassroomPropTypes.node.isRequired,
})(ConnectedKnowledgePlaceholder);
