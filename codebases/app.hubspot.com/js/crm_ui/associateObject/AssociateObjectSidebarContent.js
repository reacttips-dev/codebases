'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import CompanyAssociationSelectorContainer from './CompanyAssociationSelectorContainer';
import ContactAssociationSelectorContainer from './ContactAssociationSelectorContainer';
import { CrmLogger } from 'customer-data-tracking/loggers';
import DealAssociationSelectorContainer from './DealAssociationSelectorContainer';
import throttle from 'transmute/throttle';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ObjectCreatorConfig from '../creator/ObjectCreatorConfig';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import ProfileObjectTypesType from 'customer-data-objects-ui-components/propTypes/ProfileObjectTypesType';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useState } from 'react';
import { Record } from 'immutable';
import TicketAssociationSelectorContainer from './TicketAssociationSelectorContainer';
import { translateObjectName } from 'customer-data-objects/record/translateObjectName';
import UIDialog from 'UIComponents/dialog/UIDialog';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UITab from 'UIComponents/nav/UITab';
import UITabs from 'UIComponents/nav/UITabs';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AssociateObjectTabContent from './associateTab/AssociateObjectTabContent';
import useIsUngatedForFlexibleAssociations from './dependencies/useIsUngatedForFlexibleAssociations';
var DIALOG_HEADER_HEIGHT = 70;
var DIALOG_FOOTER_HEIGHT = 88;
var OBJECT_TYPE_TO_SELECTOR_CONTAINER = {
  CONTACT: ContactAssociationSelectorContainer,
  COMPANY: CompanyAssociationSelectorContainer,
  DEAL: DealAssociationSelectorContainer,
  TICKET: TicketAssociationSelectorContainer
};

function calculateScrollContainerHeight(windowHeight, isEmbedded) {
  return isEmbedded ? windowHeight - DIALOG_FOOTER_HEIGHT : windowHeight - (DIALOG_FOOTER_HEIGHT + DIALOG_HEADER_HEIGHT);
}

var TABS = {
  ADD_EXISTING: 'add-existing',
  CREATE_NEW: 'create-new'
};
export default function AssociateObjectSidebarContent(_ref) {
  var associationObjectType = _ref.associationObjectType,
      objectCreatorParams = _ref.objectCreatorParams,
      objectType = _ref.objectType,
      onConfirmAssociate = _ref.onConfirmAssociate,
      onConfirmCreate = _ref.onConfirmCreate,
      onConfirmError = _ref.onConfirmError,
      onReject = _ref.onReject,
      primaryAssociatedObjectId = _ref.primaryAssociatedObjectId,
      subjectId = _ref.subjectId,
      bodyText = _ref.bodyText,
      isEmbedded = _ref.isEmbedded,
      suggestedAssociations = _ref.suggestedAssociations;
  var ObjectCreatorComponent = ObjectCreatorConfig[associationObjectType].component;
  var orderedTabs = useMemo(function () {
    if ([CONTACT, COMPANY].includes(associationObjectType)) {
      return [TABS.ADD_EXISTING, TABS.CREATE_NEW];
    }

    return [TABS.CREATE_NEW, TABS.ADD_EXISTING];
  }, [associationObjectType]);
  var isUngatedForFlexibleAssociations = useIsUngatedForFlexibleAssociations(objectType, associationObjectType);
  var SelectorContainerComponent = isUngatedForFlexibleAssociations ? AssociateObjectTabContent : OBJECT_TYPE_TO_SELECTOR_CONTAINER[associationObjectType];

  var _useState = useState(calculateScrollContainerHeight(window.innerHeight, isEmbedded)),
      _useState2 = _slicedToArray(_useState, 2),
      scrollContainerHeight = _useState2[0],
      setScrollContainerHeight = _useState2[1];

  var _useState3 = useState(orderedTabs[0]),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedTab = _useState4[0],
      setSelectedTab = _useState4[1];

  useEffect(function () {
    var updateScrollContainerHeight = throttle(200, function () {
      return setScrollContainerHeight(calculateScrollContainerHeight(window.innerHeight, isEmbedded));
    });
    window.addEventListener('resize', updateScrollContainerHeight);
    return function () {
      window.removeEventListener('resize', updateScrollContainerHeight);
    };
  });

  function handleCreateButtonClick() {
    setSelectedTab(TABS.CREATE_NEW);
  }

  function handleTabChange(e) {
    var newTab = e.target.value;
    CrmLogger.log('recordInteractions', {
      action: "Changed to the " + newTab + " tab in the associate panel"
    });
    setSelectedTab(newTab);
  }

  var detailsTextTranslationKey = useMemo(function () {
    switch (associationObjectType) {
      case CONTACT:
        return 'sidebar.associateObjectDialog.details.CONTACT';

      case COMPANY:
        return 'sidebar.associateObjectDialog.details.COMPANY';

      case DEAL:
        return 'sidebar.associateObjectDialog.details.DEAL';

      case TICKET:
        return 'sidebar.associateObjectDialog.details.TICKET';

      default:
        return '';
    }
  }, [associationObjectType]);

  function renderTabContents(tabName) {
    var primaryAssociationProps = {};

    if (tabName === TABS.ADD_EXISTING) {
      if (isUngatedForFlexibleAssociations) {
        primaryAssociationProps.primaryAssociatedObjectId = primaryAssociatedObjectId;
      }

      return /*#__PURE__*/_jsx(SelectorContainerComponent, Object.assign({
        associationObjectType: associationObjectType,
        objectType: objectType,
        onCreateObject: handleCreateButtonClick,
        subjectId: subjectId,
        onConfirm: onConfirmAssociate,
        onConfirmError: onConfirmError,
        onReject: onReject,
        isUngatedForFlexibleAssociations: isUngatedForFlexibleAssociations,
        suggestedAssociations: suggestedAssociations
      }, primaryAssociationProps));
    }

    return /*#__PURE__*/_jsx(ObjectCreatorComponent, Object.assign({}, objectCreatorParams, {
      embedded: isEmbedded,
      onConfirm: onConfirmCreate,
      onReject: onReject,
      shouldRenderContentOnly: true,
      shouldRenderConfirmAndAddButton: associationObjectType !== COMPANY || isUngatedForFlexibleAssociations
    }));
  }

  function renderSidebarTab(tabName) {
    var tabNameKey = tabName === TABS.ADD_EXISTING ? 'sidebar.associateObjectDialog.tabs.addExisting' : 'sidebar.associateObjectDialog.tabs.createNew';
    return /*#__PURE__*/_jsx(UITab, {
      tabId: tabName,
      "data-selenium-test": "associate-panel-tab-" + tabName,
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: tabNameKey,
        options: {
          associationObjectName: translateObjectName(associationObjectType)
        }
      }),
      children: renderTabContents(tabName)
    }, tabName);
  }

  function renderBodyText() {
    return bodyText || /*#__PURE__*/_jsx(FormattedMessage, {
      message: detailsTextTranslationKey,
      options: {
        objectName: translateObjectName(objectType)
      }
    });
  }

  function renderSidebarTabs() {
    return orderedTabs.map(renderSidebarTab);
  }

  return /*#__PURE__*/_jsx(UIDialog, {
    children: /*#__PURE__*/_jsx("div", {
      style: {
        height: scrollContainerHeight,
        overflow: 'scroll'
      },
      children: /*#__PURE__*/_jsxs(UIDialogBody, {
        children: [/*#__PURE__*/_jsx("div", {
          className: "p-bottom-8",
          children: renderBodyText()
        }), /*#__PURE__*/_jsx(UITabs, {
          panelClassName: "p-x-0 p-bottom-0 m-bottom-0",
          selected: selectedTab,
          onSelectedChange: handleTabChange,
          use: "enclosed",
          children: renderSidebarTabs()
        })]
      })
    })
  });
}
AssociateObjectSidebarContent.propTypes = {
  associationObjectType: ObjectTypesType.isRequired,
  objectCreatorParams: PropTypes.shape({
    sourceApp: PropTypes.string,
    objectType: ProfileObjectTypesType,
    association: PropTypes.string,
    properties: PropTypes.instanceOf(Record),
    additionalRequiredProperties: ImmutablePropTypes.listOf(PropTypes.string)
  }),
  objectType: ObjectTypesType.isRequired,
  onConfirmAssociate: PropTypes.func.isRequired,
  onConfirmCreate: PropTypes.func.isRequired,
  onConfirmError: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  primaryAssociatedObjectId: PropTypes.number,
  subjectId: PropTypes.string,
  bodyText: PropTypes.string,
  isEmbedded: PropTypes.bool,
  suggestedAssociations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectType: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }))
};