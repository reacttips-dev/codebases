'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ObjectsActions from 'crm_data/objects/ObjectsActions';
import { hide } from '../../../../api/prospects/ProspectsPreferencesAPI';
import { clearSelected } from '../../../../flux/grid/GridUIActions';
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import { CrmLogger } from 'customer-data-tracking/loggers';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';

var BulkHideProspectButton = function BulkHideProspectButton(props) {
  var deleteCleanUp = function deleteCleanUp() {
    var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var objectType = props.bulkActionProps.get('objectType');
    ObjectsActions.bulkUpdateStoresLocal(objectType, ids, null);
    return clearSelected();
  };

  var onClick = function onClick() {
    var hiddenDomains = props.bulkActionProps.get('checked').toArray();
    hide(hiddenDomains).then(function () {
      deleteCleanUp(hiddenDomains);
      CrmLogger.log('indexUsage', {
        action: 'hide company'
      });
    }).done();
  };

  var options = props.options,
      icon = props.icon;
  return /*#__PURE__*/_jsx(BulkActionButton, {
    icon: icon,
    onClick: onClick,
    options: options,
    title: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "topbarContents.hideCompany"
    })
  });
};

BulkHideProspectButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  icon: PropTypes.string.isRequired,
  options: PropTypes.object
};
export default BulkHideProspectButton;