import ClassroomPropTypes from 'components/prop-types';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PropTypes from 'prop-types';
import { getContext } from 'recompose';

function showOmacContent(nanodegree) {
  return (
    NanodegreeHelper.isOMACv2(nanodegree) ||
    NanodegreeHelper.isNFP1(nanodegree) ||
    NanodegreeHelper.isMenaChallenge(nanodegree)
  );
}

// accepts only exactly one child
export const OmacPlaceholder = ({ root, children, placeholder }) => {
  return showOmacContent(root) ? children : placeholder;
};

OmacPlaceholder.propTypes = {
  root: ClassroomPropTypes.node.isRequired,
  children: PropTypes.node,
  placeholder: PropTypes.node,
};

OmacPlaceholder.defaultProps = {
  children: null,
  placeholder: null,
};

OmacPlaceholder.displayName = 'common/omac-placeholder';

export default getContext({
  root: ClassroomPropTypes.node.isRequired,
})(OmacPlaceholder);
