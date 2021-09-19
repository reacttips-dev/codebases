import appendQuery from 'append-query';

import { constructMSAImageUrl } from 'helpers/index.js';
import { getScreenSize } from 'helpers/HtmlHelpers';
import marketplace from 'cfg/marketplace.json';
import { AllJanusSlotNames, FormattedJanusReco, JanusData, JanusLimits, RecoFromJanus } from 'types/mafia';

const {
  recos: { slots },
  pdp: { recos: productRecoSlots }
} = marketplace;

interface RecoSlotDetails {
  limit: string;
  widget: string;
  filters?: Filter[];
  'pf_rd_p'?: string;
}
interface Filter {
  name: string;
  value: string[];
  recoId?: string;
}

export function makeRecoMSAImage(imageMSAId: string) {
  const opts = { autoCrop: true, width: 272 };
  return constructMSAImageUrl(imageMSAId, opts);
}

// Each filter key must be suffixed with a unique id identifying the reco they belong to.
// This id is either already baked within the filter (f.recoId) or a recommender slot id (slotDetails.pf_rd_p).
const buildRecoKeyFilterPart = (slotDetails: RecoSlotDetails) => (f: Filter) => ([f.name, JSON.stringify(f.value)]
  .concat(f.recoId || slotDetails.pf_rd_p || '').filter(Boolean))
  .join('_');

export function buildRecosKey(slotDetails: RecoSlotDetails, recoName = '') {
  return (slotDetails.filters || [])
    .map(buildRecoKeyFilterPart(slotDetails))
    .concat(!slotDetails?.filters?.length && recoName || '').filter(Boolean).join('_'); // Some recos are uniquely identified with a widget name (e.g. 'home-1').
}

function fixBadApiValues(filterValue: string) {
  const filterString = filterValue.replace(/, '/g, ',\'');
  const replaced = filterString.replace(/[[\]']/g, '');
  return replaced.split(',');
}

function calculatePercentOff(price: string, basePrice: string) {
  const rawPrice = Number(price.replace('$', ''));
  const rawBasePrice = Number(basePrice.replace('$', ''));
  if ((rawPrice && rawBasePrice) && (rawPrice !== rawBasePrice)) {
    return Math.round((1 - (rawPrice / rawBasePrice)) * 100) + '%';
  }
  return '0%';
}

export function parseRecommenderFilterValue(filterValue: string | string[]): string[] {
  if (Array.isArray(filterValue)) {
    // did the gateway API get improved so we don't have to do this workaround?
    return filterValue;
  } else if (typeof filterValue === 'string'
            && filterValue.indexOf('[') === 0
            && filterValue.indexOf(']') === filterValue.length - 1) {
    return fixBadApiValues(filterValue);
  }
  return [];
}

// janus properties are terrible, let's make them more similar to the cloud catalog / calypso property names
export function normalizeToPatronLikeProduct({ brand, c_base_price: originalPrice, price, name, logical_id: logicalId, item_id: itemId, link, imageId }: RecoFromJanus, recoName: string): FormattedJanusReco {

  const imageThumbnail = makeRecoMSAImage(imageId);

  if (recoName && link) {
    link = appendQuery(link, `ref=${recoName}`);
  }
  return {
    brandName: brand,
    originalPrice,
    price,
    percentOff: calculatePercentOff(price, originalPrice),
    productName: name,
    productId: logicalId,
    productUrl: `/product/${logicalId}${recoName ? `?ref=${recoName}` : ''}`,
    styleId: itemId,
    thumbnailImageId: imageId,
    thumbnailImageUrl: imageThumbnail,
    recoName,
    imageId,
    link
  };
}

export function buildProductPageRecoKey(productId: string, extraId?: string): string {
  const extra = (extraId) ? `_${extraId}` : '';
  return `pdp_${productId}${extra}`;
}

export function getRecosSlot(recos: any /** TODO ts Fix this later, this function is a mess */, slot: 'slot0' | 'slot1' | 'slot2' | 'slot3', lastReceivedRecoKey?: string) {
  const recoSlots = (productRecoSlots[slot] as AllJanusSlotNames[] | undefined) || null;
  if (recoSlots) {
    const mainSlot = recoSlots[0];
    const backupSlot = recoSlots[1];
    const { [mainSlot]: detail, [backupSlot]: backupDetail } = recos;
    const mainSlotRecos = detail && (detail.recos || detail.sims);
    const backupSlotRecos = backupDetail && (backupDetail.recos || backupDetail.sims);
    if (mainSlotRecos && mainSlotRecos.length) {
      return detail;
    } else if (backupSlotRecos && backupSlotRecos.length) {
      return backupDetail;
    } else if (lastReceivedRecoKey && recos[lastReceivedRecoKey]) {
      const lastReceivedFirstChoice = recos[lastReceivedRecoKey][slot];
      const lastReceivedBackup = recos[lastReceivedRecoKey][backupSlot];
      if (lastReceivedFirstChoice && lastReceivedFirstChoice.recos.length) {
        return lastReceivedFirstChoice;
      } else if (lastReceivedBackup && lastReceivedBackup.recos.length) {
        return lastReceivedBackup;
      }
    }
  }
  return null;
}

export function buildRequestSlots(isVisualRecos: boolean, isExternalRequest: boolean, shouldLoadDetail0Slot: boolean, hydraBlueSkyPdp: boolean, slotLimits = slots) {

  const screenSize = getScreenSize();

  // Always include detail-2
  const requestSlots = ['detail-2'];

  // Only fetch sidebar recos on desktop viewports or on all screens when in Blue Sky PDP test
  if (screenSize === 'desktop' || (hydraBlueSkyPdp)) {
    requestSlots.unshift('detail-1'); // Set this slot as the first position to not mess with the wacky `limits` pattern
  }

  if (isVisualRecos) {
    requestSlots.push('detail-vis-sims');
  }

  if (isExternalRequest) {
    requestSlots.push('detail-ext-search-2');
  } else {
    requestSlots.push('detail-3');
  }
  if (shouldLoadDetail0Slot) {
    requestSlots.push('detail-0'); // push complete the look reco slot last to not screw up the others
  }

  type JanusRequestParams = {
    widgets: string;
    limits: JanusLimits;
  };
  // now we have the slots and limits, so order it in the way that janus wants
  const janusRequestParams: JanusRequestParams = { limits: {}, widgets: '' };
  janusRequestParams.widgets = requestSlots.join(',');
  for (let i = 0; i < requestSlots.length; i++) {
    janusRequestParams.limits[`limit_${i}` as keyof JanusLimits] = slotLimits[requestSlots[i] as keyof typeof slotLimits];
  }
  return janusRequestParams;
}

// generate tid for janus recommendations
export function generateTid() {
  let g = '';
  for (let k = 0; k < 32; k++) {
    const j = Math.floor(Math.random() * 61);
    g = g + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.substring(j, j + 1);
  }
  return g;
}

// Returns a boolean seeing if recommendations should update
// TODO ts Type this function when `hearts` are typed
export function shouldRecosUpdate(props: any, nextProps: any): boolean {
  if (nextProps.similarProductRecos.isLoading) {
    return false;
  }
  if (props.heartsData?.heartsList !== nextProps.heartsData?.heartsList) {
    return true;
  }
  if (props.similarProductRecos.lastReceivedRecoKey === nextProps.similarProductRecos.lastReceivedRecoKey) {
    return false;
  }
  return true;
}

export function getRecoSlotData(preferredSlot: JanusData, backupSlot?: JanusData) {
  if (preferredSlot?.recos?.length) {
    return preferredSlot;
  }
  return backupSlot;
}
