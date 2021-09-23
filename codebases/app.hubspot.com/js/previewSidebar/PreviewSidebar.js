'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { CALL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import PropTypes from 'prop-types';
import SidebarError from 'customer-data-sidebar/SidebarError';
import TranscriptSidebar from 'transcript-sidebar/components/TranscriptSidebar';
import UniversalPreviewSidebarAsync from './UniversalPreviewSidebarAsync';

var PreviewSidebar = function PreviewSidebar(_ref) {
  var objectType = _ref.objectType,
      onClose = _ref.onClose,
      onObjectCreate = _ref.onObjectCreate,
      onObjectDelete = _ref.onObjectDelete,
      onObjectUpdate = _ref.onObjectUpdate,
      subjectId = _ref.subjectId;
  var SidebarContent;

  if (objectType === CALL_TYPE_ID) {
    SidebarContent = /*#__PURE__*/_jsx(TranscriptSidebar, {
      engagementId: +subjectId,
      onCloseSidebar: onClose
    });
  } else {
    SidebarContent = /*#__PURE__*/_jsx(UniversalPreviewSidebarAsync, {
      objectType: objectType,
      onCloseSidebar: onClose,
      onObjectCreate: onObjectCreate,
      onObjectDelete: onObjectDelete,
      onObjectUpdate: onObjectUpdate,
      subjectId: subjectId
    });
  }

  return /*#__PURE__*/_jsx(ErrorBoundary, {
    ErrorComponent: SidebarError,
    boundaryName: "IndexPage_SidebarError",
    children: SidebarContent
  });
};

PreviewSidebar.propTypes = {
  objectType: AnyCrmObjectTypePropType.isRequired,
  onObjectCreate: PropTypes.func,
  onObjectDelete: PropTypes.func,
  onObjectUpdate: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  subjectId: PropTypes.string.isRequired
};
export default PreviewSidebar;