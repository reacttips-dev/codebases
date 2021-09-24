'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as links from 'SequencesUI/lib/links';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { isError, isLoading, isResolved } from 'reference-resolvers/utils';
import EmptyCell from './EmptyCell';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UILink from 'UIComponents/link/UILink';

var SequencesNameCell = function SequencesNameCell(_ref) {
  var sequence = _ref.sequence;

  if (isLoading(sequence)) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "extra-small"
    });
  }

  if (isError(sequence)) {
    return /*#__PURE__*/_jsx(EmptyCell, {});
  }

  if (isResolved(sequence)) {
    return /*#__PURE__*/_jsx(UILink, {
      href: links.sequenceSummary(sequence.id),
      external: true,
      truncate: true,
      children: sequence.label
    });
  }

  return /*#__PURE__*/_jsx(EmptyCell, {});
};

SequencesNameCell.propTypes = {
  sequence: PropTypes.object
};

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    sequence: resolvers[ReferenceObjectTypes.SEQUENCE].byId(props.sequenceId)
  };
};

var SequenceName = ResolveReferences(mapResolversToProps)(SequencesNameCell);
export default SequenceName;