"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHubletPostfix = getHubletPostfix;
exports.getSubDomain = getSubDomain;
exports.getDomain = getDomain;
exports.getEnvPostfix = getEnvPostfix;
exports.getDomainPrefix = getDomainPrefix;
exports.getHubletDomainPostfix = getHubletDomainPostfix;
exports.getTld = getTld;

var _enviro = _interopRequireDefault(require("enviro"));

var Hublets = _interopRequireWildcard(require("../hublets"));

function getHubletPostfix(overrideConfig) {
  var hasHubletOverride = overrideConfig && overrideConfig.hubletOverride;
  var hubletToUse = hasHubletOverride ? overrideConfig.hubletOverride : _enviro.default.getHublet();

  if (hubletToUse === Hublets.na1) {
    return '';
  }

  return "-" + hubletToUse;
}

function getSubDomain(prefix, overrideConfig) {
  var hasHubletPostfixxOverride = overrideConfig && overrideConfig.hubletPostfixLocation && overrideConfig.hubletPostfixLocation === 'domain';

  if (hasHubletPostfixxOverride) {
    return prefix;
  }

  return "" + prefix + getHubletPostfix(overrideConfig);
}

function getDomain(overrideConfig) {
  var domainPrefix = getDomainPrefix(overrideConfig);
  var envPostfix = getEnvPostfix(overrideConfig);
  var hubletDomainPostfix = getHubletDomainPostfix(overrideConfig);
  return "" + domainPrefix + envPostfix + hubletDomainPostfix;
}

function getEnvPostfix(overrideConfig) {
  var hasEnvOverride = overrideConfig && overrideConfig.envOverride;
  var envToUse = hasEnvOverride ? overrideConfig.envOverride : _enviro.default.getShort();

  if (envToUse === 'qa') {
    return 'qa';
  }

  return '';
}

function getDomainPrefix(overrideConfig) {
  var hasDomainOverride = overrideConfig && overrideConfig.domainOverride;

  if (hasDomainOverride) {
    return overrideConfig.domainOverride;
  }

  return 'hubspot';
}

function getHubletDomainPostfix(overrideConfig) {
  var hasHubletPostfixxOverride = overrideConfig && overrideConfig.hubletPostfixLocation && overrideConfig.hubletPostfixLocation === 'domain';

  if (!hasHubletPostfixxOverride) {
    return '';
  }

  return getHubletPostfix(overrideConfig);
}

function getTld(overrideConfig) {
  var hasTldOverride = overrideConfig && overrideConfig.tldOverride;

  if (hasTldOverride) {
    return overrideConfig.tldOverride;
  }

  return 'com';
}