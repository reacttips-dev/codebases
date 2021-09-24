'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'general-store';
import { isEmpty, isLoading } from 'crm_data/flux/LoadingStatus';
import { toString } from 'customer-data-objects/model/ImmutableModel';
import DisplayValueText from 'customer-data-filters/components/display/DisplayValueText';
import PropTypes from 'prop-types';
import SubjectDependency from '../flux/dependencies/SubjectDependency';
import SubjectType from 'customer-data-objects-ui-components/propTypes/SubjectType';

function FilterValueAssociation(props) {
  var subject = props.subject,
      value = props.value;
  return /*#__PURE__*/_jsx(DisplayValueText, {
    value: isLoading(subject) || isEmpty(subject) ? value : toString(subject)
  });
}

FilterValueAssociation.propTypes = {
  subject: SubjectType,
  value: PropTypes.string
};
var deps = {
  subject: SubjectDependency
};
export default connect(deps)(FilterValueAssociation);