'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import I18n from 'I18n';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardSection from 'UIComponents/card/UICardSection';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaLeft from 'UIComponents/layout/UIMediaLeft';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import UILink from 'UIComponents/link/UILink';
import UIBadge from 'UIComponents/badge/UIBadge';
import SocialContext from '../app/SocialContext';
import { feedUserProp } from '../../lib/propTypes';
import PropTypes from 'prop-types';
import { propertyLabelTranslator, stageLabelTranslator } from 'property-translator/propertyTranslator';
import { uppercaseFirstLetter } from '../../lib/utils';
import UIDescriptionList from 'UIComponents/list/UIDescriptionList';
var CONTACT_TO_PROPERTY_TRANSLATOR_KEY = {
  firstname: 'First Name',
  followercount: 'Follower count',
  jobtitle: 'Job title',
  kloutscoregeneral: 'Klout score',
  lastname: 'Last name',
  lifecyclestage: 'Lifecycle stage',
  linkedinbio: 'Linkedin bio',
  salesforcecontactid: 'Salesforce contact ID',
  salesforceopportunitystage: 'Salesforce opportunity stage',
  salesforceowneremail: 'Salesforce owner email',
  salesforceownerid: 'Salesforce owner ID',
  salesforceownername: 'Salesforce owner name',
  salesforceurl: 'Salesforce url',
  twitterbio: 'Twitter bio',
  twitterhandle: 'Twitter handle'
};

var ContactCard = /*#__PURE__*/function (_Component) {
  _inherits(ContactCard, _Component);

  function ContactCard() {
    _classCallCheck(this, ContactCard);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContactCard).apply(this, arguments));
  }

  _createClass(ContactCard, [{
    key: "getContactUrl",
    value: function getContactUrl(vid) {
      return "/contacts/" + this.props.portalId + "/contact/" + vid;
    }
  }, {
    key: "renderContactSection",
    value: function renderContactSection(propertyName) {
      var _this = this;

      var link = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var contact = this.props.profile.contact;
      var propertyValue = contact.get('properties').get(propertyName);
      var propertyNameLabel = propertyLabelTranslator(CONTACT_TO_PROPERTY_TRANSLATOR_KEY[propertyName] || uppercaseFirstLetter(propertyName));
      var renderedValue = propertyValue;

      if (propertyName === 'lifecyclestage') {
        var translatedStage = stageLabelTranslator({
          label: propertyValue,
          objectType: 'CONTACT',
          pipelineId: 'contacts-lifecycle-pipeline',
          // https://hubspot.slack.com/archives/C01FU5BG3RC/p1624549231219500?thread_ts=1622659434.071300&cid=C01FU5BG3RC
          stageId: propertyValue
        });

        if (translatedStage) {
          renderedValue = translatedStage;
        }
      }

      if (link) {
        renderedValue = /*#__PURE__*/_jsx(UILink, {
          external: true,
          href: propertyValue,
          onClick: function onClick() {
            return _this.context.trackInteraction('view contact website');
          },
          children: propertyValue
        });
      }

      return propertyValue && [/*#__PURE__*/_jsx("dt", {
        children: propertyNameLabel
      }, propertyNameLabel), /*#__PURE__*/_jsx("dd", {
        className: "value-" + propertyName,
        children: renderedValue
      }, renderedValue)];
    }
  }, {
    key: "renderContact",
    value: function renderContact() {
      return /*#__PURE__*/_jsx(UIDescriptionList, {
        className: "properties m-top-4",
        children: /*#__PURE__*/_jsxs(UIGrid, {
          children: [/*#__PURE__*/_jsxs(UIGridItem, {
            size: {
              xs: 6
            },
            children: [this.renderContactSection('email'), this.renderContactSection('salesforceownername')]
          }), /*#__PURE__*/_jsx(UIGridItem, {
            size: {
              xs: 6
            },
            children: this.renderContactSection('lifecyclestage')
          }), /*#__PURE__*/_jsx(UIGridItem, {
            size: {
              xs: 12
            },
            children: this.renderContactSection('website', true)
          })]
        })
      });
    }
  }, {
    key: "renderAvatar",
    value: function renderAvatar() {
      var _this2 = this;

      var contact = this.props.profile.contact;

      if (!contact) {
        return /*#__PURE__*/_jsx(UIAvatar, {
          className: "avatar",
          size: "xl",
          src: this.props.profile.getProfileImage()
        });
      }

      var avatarEl = /*#__PURE__*/_jsx(UIAvatar, {
        className: "avatar",
        lookup: {
          type: 'vid',
          primaryIdentifier: contact.vid
        },
        size: "xl"
      });

      return /*#__PURE__*/_jsx(UILink, {
        className: "is-contact",
        target: "_blank",
        href: this.getContactUrl(contact.vid),
        onClick: function onClick() {
          return _this2.context.trackInteraction('view contact record from avatar');
        },
        children: avatarEl
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var contact = this.props.profile.contact;

      if (contact) {
        this.context.trackInteraction('display contact', undefined, {
          onlyOnce: true
        });
      }

      var isPage = this.props.profile.facebookProfile && this.props.profile.facebookProfile.get('data').get('type') === 'page';
      return /*#__PURE__*/_jsx(UICardWrapper, {
        className: "contact-card",
        compact: true,
        children: /*#__PURE__*/_jsx(UICardSection, {
          children: /*#__PURE__*/_jsxs(UIMedia, {
            children: [/*#__PURE__*/_jsx(UIMediaLeft, {
              children: this.renderAvatar()
            }), /*#__PURE__*/_jsx(UIMediaBody, {
              className: "profile-name",
              children: /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "title-wrapper",
                  children: [/*#__PURE__*/_jsx("h2", {
                    children: contact ? contact.getName() : this.props.profile.getName()
                  }), isPage && /*#__PURE__*/_jsx(UIBadge, {
                    className: "page-badge",
                    children: I18n.text('sui.inbox.summary.page')
                  })]
                }), contact && /*#__PURE__*/_jsx(UILink, {
                  className: "contact-link",
                  href: this.getContactUrl(contact.vid),
                  external: true,
                  onClick: function onClick() {
                    return _this3.context.trackInteraction('view contact record');
                  },
                  children: I18n.text('sui.profile.contact.viewContact')
                }), this.props.profile.contact && this.renderContact()]
              })
            })]
          })
        })
      });
    }
  }]);

  return ContactCard;
}(Component);

ContactCard.propTypes = {
  profile: feedUserProp,
  portalId: PropTypes.number.isRequired
};
ContactCard.contextType = SocialContext;
export { ContactCard as default };