'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import CompaniesExistStore from '../../../../flux/companies/CompaniesExistStore';
import VisitsStore from 'crm_data/prospects/VisitsStore';
import { clearSelected } from '../../../../flux/grid/GridUIActions';
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import ProspectsActions from '../../../../prospects/ProspectsActions';
import { toString } from 'customer-data-objects/model/ImmutableModel';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';

var BulkAddProspectButton = function BulkAddProspectButton(props) {
  var options = props.options,
      bulkActionProps = props.bulkActionProps;

  var onClick = function onClick() {
    var checked = bulkActionProps.get('checked');
    VisitsStore.get(checked).forEach(function (visit) {
      var domain = visit.get('domain');

      if (visit && !CompaniesExistStore.get(domain)) {
        ProspectsActions.addCompany(toString(visit), domain);
      }
    });
    clearSelected();
    CrmLogger.log('indexUsage', {
      action: 'bulk add to crm'
    });
  };

  return /*#__PURE__*/_jsx(BulkActionButton, {
    icon: "add",
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.addCompanyToDatabase"
    })
  });
};

BulkAddProspectButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object
};
export default BulkAddProspectButton;