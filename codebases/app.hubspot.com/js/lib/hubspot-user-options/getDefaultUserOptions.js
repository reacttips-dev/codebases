'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import EnrolledByAll from 'SequencesUI/constants/EnrolledByAll';
import UserContainer from 'SequencesUI/data/UserContainer';
import * as UsersApi from 'SequencesUI/api/UsersApi';
export default function (defaultUserIds) {
  var myUserId = UserContainer.get().user_id;
  var meOption = {
    text: I18n.text('summary.me'),
    value: "" + myUserId,
    help: I18n.text('sequencesui.analyze.filters.enrolledBy.meHelpText'),
    icon: 'dynamicFilter'
  };

  if (defaultUserIds.length === 1 && defaultUserIds[0] === EnrolledByAll || +defaultUserIds[0] === myUserId) {
    return Promise.resolve([meOption]);
  }

  return UsersApi.getUsersById(defaultUserIds).then(function (users) {
    var options = [meOption];
    users.users.map(function (user) {
      return options.push({
        text: formatName(user),
        value: "" + user.id,
        help: user.email
      });
    });
    return options;
  }, function (error) {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.fetchUsersError"
      }),
      type: 'danger'
    });
    rethrowError(error);
  });
}