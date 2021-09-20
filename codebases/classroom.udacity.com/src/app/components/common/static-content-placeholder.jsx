import ClassroomPropTypes from 'components/prop-types';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import { getContext } from 'recompose';

// accepts only exactly one child
export const StaticContentPlaceholder = ({ root, children, placeholder }) => {
  return SemanticTypes.isNanodegree(root) && NanodegreeHelper.isStatic(root)
    ? placeholder
    : children;
};

StaticContentPlaceholder.propTypes = {
  root: ClassroomPropTypes.node.isRequired,
  children: PropTypes.node,
  placeholder: PropTypes.node,
};

StaticContentPlaceholder.defaultProps = {
  children: null,
  placeholder: null,
};

StaticContentPlaceholder.displayName = 'common/static-content-placeholder';

export default getContext({
  root: ClassroomPropTypes.node.isRequired,
})(StaticContentPlaceholder);
