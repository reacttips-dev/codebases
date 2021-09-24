import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {MobileContext} from '../../../enhancers/mobile-enhancer';
import {Container} from '../card';
import ContactVendorButton from '../../buttons/contact-vendor';
import {PHONE_LANDSCAPE, PHONE, TABLET} from '../../../style/breakpoints';
import {STEP_DIRECT_LINK} from './constants';

let DesktopVendorModal = null;

const StyledContainer = glamorous(Container)(
  {
    [PHONE_LANDSCAPE]: {
      ' > div': {
        display: 'flex',
        justifyContent: 'center'
      }
    }
  },
  {
    [PHONE]: {
      boxSizing: 'border-box'
    }
  },
  ({minimal, altStyle}) => ({
    marginLeft: minimal ? 'auto' : 0,
    marginRight: minimal ? 10 : 0,
    width: minimal ? 'auto' : '100%',
    [PHONE]: {
      padding: altStyle ? 0 : 10
    },
    '&:last-child': {
      ' > div': {
        margin: altStyle ? 0 : '0 auto',
        maxWidth: altStyle ? 260 : 225,
        [TABLET]: {
          margin: minimal ? '3px 0 0 0' : altStyle ? 0 : '0 auto',
          maxWidth: altStyle ? '100%' : 225
        }
      }
    }
  })
);

const ContactVendorCard = ({
  toolId,
  contactEnabled = false,
  onLoadMobileVendorModal = null,
  contactButtonText,
  contactFlow = null,
  vendorName,
  minimal = false,
  altStyle = false,
  analyticsData = {}
}) => {
  const [showDesktopVendorModal, setShowDesktopVendorModal] = useState(false);
  const [loadedDesktopVendorModal, setLoadedDesktopVendorModal] = useState(false);

  const isMobile = useContext(MobileContext);

  const titleText = contactButtonText ? contactButtonText : `Talk to ${vendorName}`;

  const externalLink =
    contactFlow && contactFlow.steps && contactFlow.steps[0] === STEP_DIRECT_LINK
      ? contactFlow.links[0].url
      : null;

  const loadDesktopVendorModal = () => {
    if (!loadedDesktopVendorModal) {
      import(/* webpackChunkName: "contact-vendor" */ '../../modals/contact-vendor/desktop.jsx').then(
        module => {
          DesktopVendorModal = module.default;
          setLoadedDesktopVendorModal(true);
        }
      );
    }
    setShowDesktopVendorModal(true);
  };

  const handleClick = () => {
    if (externalLink) {
      window.open(externalLink, '_blank');
    } else {
      if (isMobile) {
        onLoadMobileVendorModal({toolId, contactFlow, title: titleText});
      } else {
        loadDesktopVendorModal();
      }
    }
  };

  return (
    <StyledContainer minimal={minimal} altStyle={altStyle}>
      {contactEnabled && (
        <ContactVendorButton
          minimal={minimal}
          text={titleText}
          onClick={handleClick}
          analyticsData={{
            ...analyticsData,
            sponsor: {...analyticsData.sponsor, url: externalLink}
          }}
        />
      )}
      {showDesktopVendorModal && loadedDesktopVendorModal && (
        <DesktopVendorModal
          toolId={toolId}
          contactFlow={contactFlow}
          title={titleText}
          onDismiss={() => {
            setShowDesktopVendorModal(false);
          }}
        />
      )}
    </StyledContainer>
  );
};

ContactVendorCard.propTypes = {
  toolId: PropTypes.string,
  contactEnabled: PropTypes.bool,
  contactButtonText: PropTypes.string,
  contactFlow: PropTypes.object,
  minimal: PropTypes.bool,
  altStyle: PropTypes.bool,
  analyticsData: PropTypes.object,
  vendorName: PropTypes.string,
  onLoadMobileVendorModal: PropTypes.func
};

export default ContactVendorCard;
