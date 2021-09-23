'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIBox from 'UIComponents/layout/UIBox';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIImage from 'UIComponents/image/UIImage';
import UIList from 'UIComponents/list/UIList';
import UISelectableBox from 'UIComponents/button/UISelectableBox';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UITruncateString from 'UIComponents/text/UITruncateString';
import H5 from 'UIComponents/elements/headings/H5';
import EmptyState from './EmptyState';
import ImageDimensions from './ImageDimensions';
import CopyrightModalButton from './CopyrightModalButton';
import { selectPreviewImage, unselectPreviewImage, selectAllPreviewImages, unselectAllPreviewImages, startImageImport } from '../../actions/BulkImageImport';
import { getPreviewURIs, makeGetPreviewByURI, areAllSelected, getSelectedPreviews, getCanImport, getHasPreviews } from '../../selectors/BulkImageImport';
var StyledList = styled(UIList).withConfig({
  displayName: "Previews__StyledList",
  componentId: "sc-1pp6mp6-0"
})(["width:100%;"]);
var CardBody = styled(UIFlex).withConfig({
  displayName: "Previews__CardBody",
  componentId: "sc-1pp6mp6-1"
})(["height:90px;"]);
var Image = styled(UIImage).withConfig({
  displayName: "Previews__Image",
  componentId: "sc-1pp6mp6-2"
})(["height:100px;width:100px;"]);
var ScrollableSection = styled(UIPanelSection).withConfig({
  displayName: "Previews__ScrollableSection",
  componentId: "sc-1pp6mp6-3"
})(["overflow:scroll;"]);
var ContentWrapper = styled.div.withConfig({
  displayName: "Previews__ContentWrapper",
  componentId: "sc-1pp6mp6-4"
})(["position:absolute;display:flex;flex-direction:column;top:0;bottom:0;width:100%;"]);
var PreviewListLabel = styled(H5).withConfig({
  displayName: "Previews__PreviewListLabel",
  componentId: "sc-1pp6mp6-5"
})(["margin:0;"]);

var i18nKey = function i18nKey(suffix) {
  return "FileManagerLib.panels.bulkImageImport.preview." + suffix;
};

var PreviewCard = function PreviewCard(_ref) {
  var previewUri = _ref.previewUri,
      onSelectedChange = _ref.onSelectedChange;
  var getPreviewByURI = useMemo(makeGetPreviewByURI, []);

  var _useSelector = useSelector(function (state) {
    return getPreviewByURI(state, previewUri);
  }),
      filename = _useSelector.filename,
      uri = _useSelector.uri,
      selected = _useSelector.selected;

  var handleSelectChanged = function handleSelectChanged(_ref2) {
    var value = _ref2.target.value;
    onSelectedChange({
      checked: value,
      previewUri: previewUri
    });
  };

  return /*#__PURE__*/_jsx(UISelectableBox, {
    className: "m-bottom-4",
    type: "checkbox",
    block: true,
    selectionMarkLocation: "top-right",
    onSelectedChange: handleSelectChanged,
    selected: selected,
    children: /*#__PURE__*/_jsxs(UIFlex, {
      direction: "row",
      align: "center",
      justify: "between",
      children: [/*#__PURE__*/_jsx(Image, {
        className: "p-right-4 image__transparency-checkboard",
        src: uri,
        objectFit: "contain",
        responsive: false
      }), /*#__PURE__*/_jsxs(CardBody, {
        direction: "column",
        justify: "center",
        className: "m-x-4",
        children: [/*#__PURE__*/_jsx(UITruncateString, {
          matchContentWidth: true,
          children: filename
        }), /*#__PURE__*/_jsx(ImageDimensions, {
          src: uri
        })]
      })]
    })
  });
};

var ListHeader = function ListHeader(_ref3) {
  var onSelectAllChanged = _ref3.onSelectAllChanged;
  var dispatch = useDispatch();
  var checked = useSelector(areAllSelected);
  var selectedURIs = useSelector(getSelectedPreviews);
  var hasSelectedURIs = selectedURIs.size > 0;
  var hasPreviews = useSelector(getHasPreviews);
  var canImport = useSelector(getCanImport);

  var handleImportSelectedImages = function handleImportSelectedImages() {
    return dispatch(startImageImport(selectedURIs));
  };

  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(UIFlex, {
      justify: "end",
      children: /*#__PURE__*/_jsx(CopyrightModalButton, {
        disabled: !hasPreviews || !canImport || !hasSelectedURIs,
        use: "primary",
        className: "m-bottom-2",
        onConfirm: handleImportSelectedImages,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: i18nKey('importSelected'),
          options: {
            count: selectedURIs.size
          }
        })
      })
    }), /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      justify: "between",
      direction: "row",
      children: [/*#__PURE__*/_jsx(PreviewListLabel, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: i18nKey('listTitle')
        })
      }), /*#__PURE__*/_jsx(UICheckbox, {
        className: "p-right-4",
        disabled: !hasPreviews,
        checked: checked,
        onChange: onSelectAllChanged,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: i18nKey('selectAll')
        })
      })]
    })]
  });
};

var Previews = function Previews() {
  var dispatch = useDispatch();
  var previews = useSelector(getPreviewURIs);

  var handleSelectAll = function handleSelectAll(_ref4) {
    var checked = _ref4.target.checked;
    return checked ? dispatch(selectAllPreviewImages()) : dispatch(unselectAllPreviewImages());
  };

  var handleSelect = function handleSelect(_ref5) {
    var checked = _ref5.checked,
        previewUri = _ref5.previewUri;
    return checked ? dispatch(selectPreviewImage(previewUri)) : dispatch(unselectPreviewImage(previewUri));
  };

  if (previews.length === 0) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  return /*#__PURE__*/_jsxs(ContentWrapper, {
    children: [/*#__PURE__*/_jsx(UIPanelSection, {
      flush: true,
      children: /*#__PURE__*/_jsx(ListHeader, {
        onSelectAllChanged: handleSelectAll
      })
    }), /*#__PURE__*/_jsx(ScrollableSection, {
      flush: true,
      children: /*#__PURE__*/_jsx(UIBox, {
        grow: 1,
        "data-test-id": "bulk-import-previews",
        children: /*#__PURE__*/_jsx(StyledList, {
          children: previews.map(function (previewUri) {
            return /*#__PURE__*/_jsx(PreviewCard, {
              previewUri: previewUri,
              onSelectedChange: handleSelect
            }, previewUri);
          })
        })
      })
    })]
  });
};

export default Previews;