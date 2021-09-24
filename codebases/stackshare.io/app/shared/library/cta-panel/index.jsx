import React, {useContext, useState} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {MobileContext} from '../../enhancers/mobile-enhancer';
import {withQuery} from '../../enhancers/graphql-enhancer';
import {contactBySlug} from '../../../data/tool-profile/queries';
import FollowServiceButton from '../buttons/follow/follow-service-button';
import {TABLET} from '../../style/breakpoints';
import UseThisButton from '../buttons/use-this';
import ToolStatsCard from '../cards/tool-stats';
import ContactVendorCard from '../cards/contact-vendor';
import {VENDOR_CTA} from '../advert/themes';
import {planPermissionCheck} from '../../utils/plan-permission-check';
import {PLANS} from '../../../bundles/private-payment/constants';

const Container = glamorous.div(
  {
    position: 'relative',
    width: 260,
    height: '100%',
    ' > div': {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '100%',
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'flex-end',
      alignItems: 'stretch',
      marginBottom: 20,
      ' > div:last-of-type > div ': {
        margin: 0,
        maxWidth: '100%'
      },
      ' a': {
        maxWidth: '100%'
      },
      ' > * + *': {
        marginTop: 10
      }
    },
    [TABLET]: {
      width: '100%',
      margin: '20px 0 0 0',
      padding: 0
    }
  },
  ({isStuck}) =>
    !isStuck
      ? {
          paddingTop: 30
        }
      : {
          paddingTop: 5,
          ' > div': {
            position: 'relative',
            bottom: 'auto',
            right: 'auto'
          }
        },
  ({isMobile}) =>
    isMobile
      ? {
          padding: 0,
          ' > div': {
            position: 'static',
            bottom: 'auto',
            right: 'auto',
            ' > :last-child': {
              padding: 0
            }
          }
        }
      : {}
);

const FlexMultiple = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  ' > button': {
    width: '48%',
    marginRight: 10,
    '&:last-child': {
      margin: 0
    }
  }
});

const FlexCenter = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const CtaPanel = ({service, onLoadMobileVendorModal, isStuck = false, currentUser, ...props}) => {
  const {id, following, stacks, votes, followers, privateFollowers, name} = service;
  const {contactEnabled, contactButtonText, contactFlow, privateMode} = props;
  const [animateFollowStat, setAnimateFollowStat] = useState(false);
  const onToggle = () => {
    if (!following) {
      setAnimateFollowStat(true);
    } else {
      setAnimateFollowStat(false);
    }
  };

  const vendorAnalyticsData = {
    path: service.slug,
    contentGroupPage: 'Services',
    sponsor: {
      name: service.name,
      serviceId: service.legacyThirdPartyId,
      featured: null,
      text: null,
      url: null
    },
    theme: VENDOR_CTA,
    layer: service.layer.name,
    category: service.category.name,
    primaryFunction: service.function.name
  };

  const isMobile = useContext(MobileContext);
  const planPermission = planPermissionCheck(privateMode, PLANS.FREE);

  return (
    <Container isStuck={isStuck} isMobile={isMobile}>
      <div>
        {!isStuck && (
          <FlexCenter>
            <ToolStatsCard
              stacks={stacks}
              votes={votes}
              followers={
                privateMode
                  ? (followers && followers.count) + (privateFollowers && privateFollowers.count)
                  : followers && followers.count
              }
              animateFollowStat={animateFollowStat}
            />
          </FlexCenter>
        )}
        <FlexMultiple>
          <FollowServiceButton serviceId={id} following={following} onToggle={onToggle} />
          <UseThisButton serviceId={id} customStyle={contactEnabled ? {} : {marginTop: 16}} />
        </FlexMultiple>

        {(!currentUser ||
          (!privateMode && currentUser) ||
          (privateMode && currentUser && planPermission)) &&
          contactEnabled && (
            <ContactVendorCard
              toolId={service.id}
              onLoadMobileVendorModal={onLoadMobileVendorModal}
              contactEnabled={contactEnabled}
              contactButtonText={contactButtonText}
              contactFlow={contactFlow}
              minimal={false}
              vendorName={name}
              analyticsData={vendorAnalyticsData}
            />
          )}
      </div>
    </Container>
  );
};

CtaPanel.propTypes = {
  service: PropTypes.object,
  isStuck: PropTypes.bool,
  contactEnabled: PropTypes.bool,
  contactButtonText: PropTypes.string,
  contactFlow: PropTypes.object,
  onLoadMobileVendorModal: PropTypes.func,
  privateMode: PropTypes.any,
  currentUser: PropTypes.object
};

export default withQuery(
  contactBySlug,
  data => ({
    contactEnabled: data && data.tool && data.tool.contactEnabled,
    contactButtonText: data && data.tool && data.tool.contactButtonText,
    contactFlow: data && data.tool && data.tool.contactFlow
  }),
  ({service}) => ({
    id: service.slug
  }),
  null,
  {ssr: false}
)(CtaPanel);
