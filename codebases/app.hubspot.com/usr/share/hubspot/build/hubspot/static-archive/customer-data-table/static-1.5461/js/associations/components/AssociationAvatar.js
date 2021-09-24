'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
var SupportedAvatarTypes = [CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID];

var getAvatarIconType = function getAvatarIconType(objectTypeId) {
  // We want to use the default type for companies and contacts because they
  // can actually have avatar images that need to be fetched. The avatar
  // component handles that all internally.
  switch (objectTypeId) {
    case DEAL_TYPE_ID:
      return 'deal';

    case TICKET_TYPE_ID:
      return 'ticket';

    default:
      return undefined;
  }
};

var getAvatarPropsForObjectType = function getAvatarPropsForObjectType(object, objectTypeId) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      return {
        vid: object.id
      };

    case COMPANY_TYPE_ID:
      return {
        companyId: object.id
      };

    default:
      return {};
  }
};

var AssociationAvatar = function AssociationAvatar(props) {
  var object = props.object,
      objectTypeId = props.objectTypeId;

  if (!SupportedAvatarTypes.includes(objectTypeId)) {
    return null;
  }

  var avatarIconType = getAvatarIconType(objectTypeId);
  var avatarPropsForObjectType = getAvatarPropsForObjectType(object, objectTypeId);
  return /*#__PURE__*/_jsx(UIAvatar, Object.assign({}, avatarPropsForObjectType, {
    className: "m-right-3",
    displayName: object.label,
    size: "xs",
    style: {
      width: '100px !important'
    },
    truncateLength: -1,
    type: avatarIconType
  }));
};

export default AssociationAvatar;