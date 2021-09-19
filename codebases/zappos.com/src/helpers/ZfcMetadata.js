import ProtoBuf from 'protobufjs';

import { utoa } from 'utils';
import ProductUtils from 'helpers/ProductUtils';

// Event Code for search See https://github01.zappos.net/SearchTeam/Helios/blob/master/src/main/java/com/zappos/helios/web/AbstractSearchBase.java#L93
const ZFC_SEARCH_ASIN_LIST_EVENT = 23;
const cookieProtobuf = `
package zap.zfc;
// this file should be kept in sync with the one in zeta.
message Metadata {
  message Event {
    message NameValuePair {
      required bytes name  = 1; // name
      required bytes value = 2; // value
    }
    required uint32        id             = 1;
    repeated NameValuePair nameValuePairs = 2;
  }
  optional uint32 result_count  = 1;
  optional bool   product_oos   = 2;
  optional bytes  server_name   = 3;
  optional float  product_price = 4;
  repeated Event  events        = 5;
  option optimize_for = SPEED;
}
`;

const builder = ProtoBuf.parse(cookieProtobuf, { keepCase: true }).root,
  ZfcMetadata = builder.lookup('zap.zfc.Metadata');

export function getProductPageZfcMetadata(product, colorId) {
  const style = ProductUtils.getStyleByColor(product.styles, colorId);
  if (style && style.price) {
    const price = ProductUtils.priceToFloat(style.price);
    return buildProductPageZfcMetadata({
      brandId: product.brandId,
      styleId: style.styleId,
      price
    });
  }
  return null;
}
//  better name for this compared to the function above?
export function buildProductPageZfcMetadata({ brandId, price, styleId }) {
  const pairs = { brandId, styleId };
  const data = ZfcMetadata.create({
    product_price: price,
    events: [ZfcMetadata.Event.create({
      nameValuePairs: Object.keys(pairs).map(name => (
        ZfcMetadata.Event.NameValuePair.create({
          name: utoa(name),
          value: utoa(pairs[name])
        })
      ))
    })]
  });

  return Buffer.from(ZfcMetadata.encode(data).finish()).toString('base64');
}

function buildSearchResultNameValuePair(product, index) {
  const valueString = `${index + 1}|${product.price && ProductUtils.priceToFloat(product.price).toFixed(2)}|${product.styleId}`;

  const nvp = ZfcMetadata.Event.NameValuePair.create({
    name: utoa('' + (index + 1)),
    value: utoa(valueString)
  });

  return nvp;
}

/**
 * Builds the ZFC Metadata for a given set of search results.  Includes result_count, as well as Single Event with
 *   * id = 23
 *   * One NameValuePair for every result, with name = 1-index position of result, and value = "${oneIndexPos|${price}\${styleId}}"
 *      e.g "1|119.00|4202429"
 * @param  {Object} searchResultResponse product results for a given search results
 * @return {Object}          The zap.zfc.Metadata protobuf object.
 */
export function buildSearchResultsZfcMetadata({ results, totalResultCount }) {
  const resultCount = parseInt(totalResultCount, 10);
  if (isNaN(resultCount) || resultCount < 1) {
    return null;
  }

  const events = [ZfcMetadata.Event.create({
    id: ZFC_SEARCH_ASIN_LIST_EVENT,
    nameValuePairs: results.map(buildSearchResultNameValuePair)
  })];

  return ZfcMetadata.create({
    result_count: resultCount,
    events
  });
}

/**
 * Builds the ZFC Metadata for a search response as a base64 encoded string.  Can be passed right off to zappalytics
 * @param  {[type]} searchResultResponse        product results for a given search results
 * @return {String}                             Based 64 encoded string representing the search page zappalytics metadata.
 */
export function buildBase64EncodedSearchResultsMetaData(searchResultResponse) {
  const protobufObject = buildSearchResultsZfcMetadata(searchResultResponse);
  return protobufObject ? Buffer.from(ZfcMetadata.encode(protobufObject).finish()).toString('base64') : null;
}

export function decodeZfcMetadata(base64EncodedMetadata) {
  return ZfcMetadata.decode(Buffer.from(base64EncodedMetadata, 'base64'));
}
