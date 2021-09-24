'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import * as UsersApi from 'SequencesUI/api/UsersApi';
import UserContainer from 'SequencesUI/data/UserContainer';
import formatName from 'I18n/utils/formatName';
export default function (query) {
  var myUserId = UserContainer.get().user_id;
  return UsersApi.searchUsers(query).then(function (response) {
    var options = response.results.reduce(function (optionsArray, user) {
      if (user.user_id === myUserId) {
        return optionsArray;
      }

      return [].concat(_toConsumableArray(optionsArray), [{
        text: formatName({
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email
        }),
        value: "" + user.user_id,
        help: user.email
      }]);
    }, []);
    var meOption = {
      text: I18n.text('summary.me'),
      value: "" + myUserId,
      help: I18n.text('sequencesui.analyze.filters.enrolledBy.meHelpText'),
      icon: 'dynamicFilter'
    };
    return {
      options: [meOption].concat(_toConsumableArray(options)),
      pagination: {
        offset: response.offset,
        hasMore: response.hasMore
      }
    };
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