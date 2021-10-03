import {
  FABRIC_GROUP_ELEMENT,
  FABRIC_TEXT_TYPES,
} from "../../_components/details/constants";
import { find, uniqBy } from "lodash";

export const prepareJSONDataForImport = (page, pageLayers, storeFontList) => {
  const workareaPayload = page.payload;
  const layers = pageLayers;
  const layerIds = page.layers;

  let canvasJSON = {
    objects: [],
    pageFonts: [],
  };

  // Workarea payload
  canvasJSON.objects.push(workareaPayload);

  layerIds.forEach((layerId, index) => {
    const layer = layers[layerId];
    if (!layer) {
      return;
    }
    let payload = Object.assign({}, layer.payload);
    // TO create consistancy and single source of truth
    payload["id"] = layer.id;
    canvasJSON.objects.push(payload);
    let layerFonts = getCurrentLayerFontList(payload, storeFontList);
    canvasJSON.pageFonts.push(...layerFonts);
  });
  // Remove duplicate font entry
  canvasJSON.pageFonts = uniqBy(canvasJSON.pageFonts, "id");

  canvasJSON.objects = canvasJSON.objects.filter((obj) => {
    if (!obj.id) {
      return false;
    }
    return true;
  });

  return canvasJSON;
};

const getCurrentLayerFontList = (layerPayload, storeFontList) => {
  if (
    FABRIC_TEXT_TYPES.includes(layerPayload.type) &&
    layerPayload.fontFamily
  ) {
    const fontDetail = getFontDetails(storeFontList, layerPayload.fontFamily);
    return [fontDetail];
  } else if (layerPayload.type === FABRIC_GROUP_ELEMENT) {
    let groupLayerFonts = [];
    layerPayload?.objects?.forEach((obj, index) => {
      const layerFonts = getCurrentLayerFontList(obj, storeFontList);
      groupLayerFonts = groupLayerFonts.concat(layerFonts);
    });
    return groupLayerFonts;
  }
  return [];
};

export const getFontDetails = (storeFontList, fontName) => {
  return find(storeFontList, ["family", fontName]);
};
