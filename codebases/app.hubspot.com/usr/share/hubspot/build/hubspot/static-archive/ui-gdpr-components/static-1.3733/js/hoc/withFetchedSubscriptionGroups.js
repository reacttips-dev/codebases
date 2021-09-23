'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getSubscriptionGroups } from '../api';
export default function withFetchedSubscriptionGroups(Component) {
  return function (props) {
    var _props$passGroups = props.passGroups,
        passGroups = _props$passGroups === void 0 ? false : _props$passGroups,
        _props$showInactive = props.showInactive,
        showInactive = _props$showInactive === void 0 ? false : _props$showInactive;

    var _useState = useState({
      groups: [],
      userAccessibleGroups: []
    }),
        _useState2 = _slicedToArray(_useState, 2),
        groupsData = _useState2[0],
        setGroupsData = _useState2[1];

    var _useState3 = useState(true),
        _useState4 = _slicedToArray(_useState3, 2),
        isLoading = _useState4[0],
        setIsLoading = _useState4[1];

    useEffect(function () {
      if (!passGroups) {
        getSubscriptionGroups(showInactive).then(function (_ref) {
          var preferencesGroups = _ref.preferencesGroups,
              userAccessibleGroups = _ref.userAccessibleGroups;
          setGroupsData({
            groups: preferencesGroups,
            userAccessibleGroups: userAccessibleGroups
          });
          setIsLoading(false);
        });
      }
    }, [passGroups, showInactive]);
    var userAccessibleGroups = groupsData.userAccessibleGroups,
        groups = groupsData.groups;

    if (passGroups) {
      return /*#__PURE__*/_jsx(Component, Object.assign({}, props));
    }

    return /*#__PURE__*/_jsx(Component, Object.assign({
      groups: groups,
      userAccessibleGroups: userAccessibleGroups,
      isLoading: isLoading
    }, props));
  };
}