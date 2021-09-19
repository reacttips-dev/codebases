import { store } from 'entrypoints/bootstrapOnClient';
import { APS_URL, GPT_URL } from 'constants/appConstants';
import { injectScriptToHead } from 'helpers/HtmlHelpers';
import { isDesktop } from 'helpers/ClientUtils';
import { getUserAdPreference } from 'actions/account/ads';
import { logError } from 'middleware/logger';
import marketplace from 'cfg/marketplace.json';

export const PDP_NARROW_MID = 'PDP-NARROW-MID';
export const PDP_NARROW_TOP = 'PDP-NARROW-TOP';
export const SRP_NARROW_MID = 'SRP-NARROW-MID';
export const SRP_NARROW_TOP = 'SRP-NARROW-TOP';
export const PDP_NARROW_BOTTOM = 'PDP-NARROW-BOTTOM';
export const PDP_NARROW_BOTTOM_TOP = 'PDP-NARROW-BOTTOM-TOP';
export const SRP_NARROW_BOTTOM = 'SRP-NARROW-BOTTOM';
export const SRP_NARROW_BOTTOM_TOP = 'SRP-NARROW-BOTTOM-TOP';
export const PDP_WIDE_BOTTOM = 'PDP-WIDE-BOTTOM';
export const PDP_WIDE_BOTTOM_LEFT = 'PDP-WIDE-BOTTOM-LEFT';
export const PDP_WIDE_BOTTOM_RIGHT = 'PDP-WIDE-BOTTOM-RIGHT';
export const PDP_WIDE_TOP = 'PDP-WIDE-TOP';
export const SRP_WIDE_BOTTOM = 'SRP-WIDE-BOTTOM';
export const SRP_WIDE_BOTTOM_LEFT = 'SRP-WIDE-BOTTOM-LEFT';
export const SRP_WIDE_BOTTOM_RIGHT = 'SRP-WIDE-BOTTOM-RIGHT';
export const SRP_WIDE_TOP = 'SRP-WIDE-TOP';
export const PDP_WIDE_MID = 'PDP-WIDE-MID';
export const SRP_WIDE_MID = 'SRP-WIDE-MID';
export const HOME_NARROW_MID = 'HOME-NARROW-MID';
export const HOME_NARROW_BOTTOM = 'HOME-NARROW-BOTTOM';
export const HOME_WIDE_MID = 'HOME-WIDE-MID';
export const HOME_WIDE_BOTTOM = 'HOME-WIDE-BOTTOM';
export const LAND_NARROW_BOTTOM = 'LAND-NARROW-BOTTOM';
export const LAND_NARROW_TOP = 'LAND-NARROW-TOP';
export const LAND_WIDE_TOP = 'LAND-WIDE-TOP';
export const LAND_WIDE_BOTTOM = 'LAND-WIDE-BOTTOM';
export const PDP_STICKY_BOTTOM = 'PDP-STICKY-BOTTOM';
export const SRP_STICKY_BOTTOM = 'SRP-STICKY-BOTTOM';
export const TEST = 'test';

// method for getting dimensions based on slot
export const getAdDimensions = slot => {
  switch (slot) {
    case PDP_WIDE_BOTTOM:
    case PDP_WIDE_TOP:
    case SRP_WIDE_BOTTOM:
    case SRP_WIDE_TOP:
    case HOME_WIDE_MID:
    case HOME_WIDE_BOTTOM:
    case LAND_WIDE_BOTTOM:
    case LAND_WIDE_TOP:
    case TEST:
      return [728, 90];
    case PDP_NARROW_MID:
    case PDP_NARROW_TOP:
    case SRP_NARROW_MID:
    case SRP_NARROW_TOP:
    case HOME_NARROW_MID:
    case LAND_NARROW_BOTTOM:
    case LAND_NARROW_TOP:
    case HOME_NARROW_BOTTOM:
    case SRP_NARROW_BOTTOM_TOP:
    case PDP_NARROW_BOTTOM_TOP:
    case PDP_STICKY_BOTTOM:
    case SRP_STICKY_BOTTOM:
      return [320, 50];
    case PDP_NARROW_BOTTOM:
    case PDP_WIDE_MID:
    case SRP_NARROW_BOTTOM:
    case SRP_WIDE_BOTTOM_LEFT:
    case SRP_WIDE_BOTTOM_RIGHT:
    case PDP_WIDE_BOTTOM_LEFT:
    case PDP_WIDE_BOTTOM_RIGHT:
      return [300, 250];
    case SRP_WIDE_MID:
      return [160, 600];
    default:
      logError(`No dimensions named ${slot}.`);
      return null;
  }
};

// map for slots to device
export const platformVisibility = {
  desktop: [
    PDP_WIDE_BOTTOM,
    PDP_WIDE_BOTTOM_LEFT,
    PDP_WIDE_BOTTOM_RIGHT,
    PDP_WIDE_TOP,
    SRP_WIDE_BOTTOM,
    SRP_WIDE_BOTTOM_LEFT,
    SRP_WIDE_BOTTOM_RIGHT,
    SRP_WIDE_TOP,
    PDP_WIDE_MID,
    SRP_WIDE_MID,
    HOME_WIDE_MID,
    HOME_WIDE_BOTTOM,
    LAND_WIDE_BOTTOM,
    LAND_WIDE_TOP,
    TEST
  ],
  mobile: [
    PDP_NARROW_MID,
    PDP_NARROW_TOP,
    SRP_NARROW_MID,
    SRP_NARROW_TOP,
    PDP_NARROW_BOTTOM,
    PDP_NARROW_BOTTOM_TOP,
    SRP_NARROW_BOTTOM,
    SRP_NARROW_BOTTOM_TOP,
    HOME_NARROW_MID,
    LAND_NARROW_TOP,
    HOME_NARROW_BOTTOM,
    LAND_NARROW_BOTTOM,
    PDP_STICKY_BOTTOM,
    SRP_STICKY_BOTTOM
  ]
};

export const defineSlotData = ({ slot, dimensions, networkId }, cb, win = window) => {
  const { googletag } = win;

  const slotName = `/${networkId}/${slot}`;
  googletag.cmd.push(() => {
      googletag.defineSlot(slotName, [dimensions], slot)?.addService(googletag.pubads());
  });

  if (cb) {
    cb({ slotName });
  }
};

export const initializeAps = ({ sourceId, networkId, slots, optOutPreference = true }, win = window) => {
  const { apstag, googletag } = win;

  slots.forEach(({ name: slot, dimensions }) => {
    defineSlotData({ slot, dimensions, networkId }, null, win);
  });

  googletag.cmd.push(() => {
    googletag.pubads().disableInitialLoad();
    !optOutPreference && googletag.pubads().setRequestNonPersonalizedAds(1), // `optOutPreference` is true if customers want personalized ads
    googletag.pubads().enableSingleRequest();
    googletag.pubads().collapseEmptyDivs();
    googletag.enableServices();
  });

  apstag.init({
    pubID: sourceId,
    adServer: 'googletag',
    bidTimeout: 2e3
  });

  injectScriptToHead({
    src: GPT_URL
  });

  injectScriptToHead({
    src: APS_URL,
    id: 'apsScript',
    onload: () => {
      fetchBids({ slots, networkId });
    }
  });
};

export const fetchBids = ({ slots, networkId }, win = window) => {
  const { apstag, googletag } = win;

  const slotData = [];

  slots.forEach(({ name: slot, dimensions }) => {
    defineSlotData({ slot, networkId, dimensions }, ({ slotName }) => {
      slotData.push({
        slotID: slot,
        slotName,
        sizes: [dimensions]
      });
    }, win);
  });

  apstag.fetchBids({ slots: slotData }, () => {
    // set apstag bids, then trigger the first request to DFP
    googletag.cmd.push(() => {
      apstag.setDisplayBids();
      googletag.pubads().refresh();
    });
  });

  slots.forEach(({ name: slot }) => {
    googletag.cmd.push(() => {
      googletag.display(slot);
    });
  });
};

export const fireApsAds = slots => {
  const { ads: { networkId, sourceId } = {} } = marketplace;
  const slotsList = formatSlotsList(slots);

  if (!slotsList.length) {
    return;
  }

  const state = store.getState();
  const adPreferences = getUserAdPreference(state);

  const { optOutPreference } = adPreferences || {};

  try {
    // if script has already been injected, re-fire ad initialization
    if (document.getElementById('apsScript')) {
      fetchBids({ networkId, slots: slotsList });
    } else {
      initializeAps({ networkId, sourceId, slots: slotsList, optOutPreference }); // otherwise inject scripts and fire ad initialization
    }
  } catch (e) { /* dont blow up if third party script fails */ }
};

// slots is a list of objects shaped like [ {name: 'HOME-NARROW-MID', size: 'mobile', height: '50', width: '320' } ]. It must at least have the `name` key/value.
export const formatSlotsList = (slots = []) => {
  const deviceType = isDesktop() ? 'desktop' : 'mobile';
  return slots.reduce((acc, { name, device, height, width }) => {
    if (device === deviceType || platformVisibility[deviceType]?.includes(name)) {
      const widthInt = parseInt(width) || 0;
      const heightInt = parseInt(height) || 0;
      const dimensions = widthInt && heightInt ? [widthInt, heightInt] : getAdDimensions(name);
      acc.push({ name, dimensions });
    }
    return acc;
  }, []);
};
