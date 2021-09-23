'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import CompanyCreatorContainer from './CompanyCreatorContainer';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';

var _CompanyCreatorContai = CompanyCreatorContainer.propTypes,
    __companyRecord = _CompanyCreatorContai.companyRecord,
    __isCreatingCompany = _CompanyCreatorContai.isCreatingCompany,
    __setCompanyRecord = _CompanyCreatorContai.setCompanyRecord,
    __setIsCreatingCompany = _CompanyCreatorContai.setIsCreatingCompany,
    propTypes = _objectWithoutProperties(_CompanyCreatorContai, ["companyRecord", "isCreatingCompany", "setCompanyRecord", "setIsCreatingCompany"]);

function CompanyCreatorContainerWrapper(props) {
  var _useState = useState(function () {
    return new CompanyRecord();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      companyRecord = _useState2[0],
      setCompanyRecord = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isCreatingCompany = _useState4[0],
      setIsCreatingCompany = _useState4[1];

  return /*#__PURE__*/_jsx(CompanyCreatorContainer, Object.assign({}, props, {
    companyRecord: companyRecord,
    isCreatingCompany: isCreatingCompany,
    setCompanyRecord: setCompanyRecord,
    setIsCreatingCompany: setIsCreatingCompany
  }));
}

CompanyCreatorContainerWrapper.propTypes = propTypes;
export default CompanyCreatorContainerWrapper;