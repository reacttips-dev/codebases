import {
  INFLUENCER_CHECKOUT_PAGE_EVENTS,
  INFLUENCER_CREATE_SHARE_LINK_EVENTS,
  INFLUENCER_ENROLLMENT_EVENTS,
  INFLUENCER_LANDING_EVENTS

} from 'constants/amethyst';

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/InfluencerEnrollmentEvent.proto
export const evEnrollInfluencer = () => ({
  [INFLUENCER_ENROLLMENT_EVENTS]: {
    influencer_type : 0,
    meta_data : 'Phase-1'
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/InfluencerCheckoutPageEvents.proto
export const evCheckoutFromInfluencer = ({ orderId, linkId, infId = null, metaData = null }) => ({
  [INFLUENCER_CHECKOUT_PAGE_EVENTS]: {
    influencer_id : infId,
    order_id : orderId,
    link_id : linkId,
    meta_data : metaData
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/InfluencerCreateShareLinkEvents.proto
export const evCreateShareLinkInfluencer = ({ userId, linkId, socialMediaId, metaData }) => ({
  [INFLUENCER_CREATE_SHARE_LINK_EVENTS]: {
    is_influencer : true,
    user_id : userId,
    link_id : linkId,
    influencer_social_media_id : socialMediaId,
    meta_data : metaData
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/InfluencerLandingEvents.proto
export const evLandingPageInfluencer = ({ linkId, pageId }) => ({
  [INFLUENCER_LANDING_EVENTS]: {
    link_id : linkId,
    page_id : pageId
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/InfluencerAddSocialProfileClick.proto
export const evAddSocialMediaToInfluencerProfile = ({ socialMediaId, wasSuccess, stateReason }) => ({
  [INFLUENCER_ADD_SOCIAL_PROFILE_CLICK]: {
    influencer_social_media_id : socialMediaId,
    was_success : wasSuccess,
    state_reason : stateReason
  }
});
