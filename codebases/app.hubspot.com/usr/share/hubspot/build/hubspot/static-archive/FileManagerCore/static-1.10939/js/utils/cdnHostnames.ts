import PortalIdParser from 'PortalIdParser';
import enviro from 'enviro';
import { na1 as DEFAULT_API_HUBLET } from 'hubspot-url-utils/hublets';
export var SHARDS_LARGEST_INDEX = 4;
var SHARD_NUMERAL_LENGTH = 2;
var SHARD_NUMERAL_SUFFIX = '0';
var LARGEST_FORMATTED_SHARD_INDEX = 50;

function getEnv() {
  return enviro.getShort('filemanager');
}

export var constructShard = function constructShard(apexDomainSuffix, formattedShardIndex) {
  return "f.hubspotusercontent" + apexDomainSuffix + formattedShardIndex + ".net";
};
export var getShardDomainSuffixFromEnv = function getShardDomainSuffixFromEnv(env) {
  return env === 'qa' ? 'qa' : '';
};
export var getFormattedShardIndex = function getFormattedShardIndex(index) {
  if (typeof String.prototype.padEnd === 'function') {
    return String(index).padEnd(SHARD_NUMERAL_LENGTH, SHARD_NUMERAL_SUFFIX);
  } else {
    if (String(index).length >= SHARD_NUMERAL_LENGTH) {
      return String(index);
    }

    return String(index * Math.pow(10, SHARD_NUMERAL_LENGTH - 1));
  }
};
export var getPortalShard = function getPortalShard() {
  return Math.floor(PortalIdParser.get() % LARGEST_FORMATTED_SHARD_INDEX / 10);
};
export var isNonDefaultHublet = function isNonDefaultHublet() {
  return enviro.getHublet() !== DEFAULT_API_HUBLET;
};
export function getCdnHostnameForNonDefaultHublet() {
  var shardApexDomainSuffix = getShardDomainSuffixFromEnv(getEnv());
  return constructShard(shardApexDomainSuffix, "-" + enviro.getHublet());
}
export var getCdnHostnameForPortal = function getCdnHostnameForPortal() {
  if (isNonDefaultHublet()) {
    return getCdnHostnameForNonDefaultHublet();
  }

  return constructShard(getShardDomainSuffixFromEnv(getEnv()), getFormattedShardIndex(getPortalShard()));
};
export var generateCdnHostnames = function generateCdnHostnames() {
  var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'prod';
  var shardApexDomainSuffix = getShardDomainSuffixFromEnv(env);
  var shardsList = new Array(SHARDS_LARGEST_INDEX + 1).fill(null).map(function (_, index) {
    return constructShard(shardApexDomainSuffix, getFormattedShardIndex(index));
  });
  return shardsList;
};