'use es6';

import { accountId } from './storageKeys';
import { eventError } from './common/messages';

var resolveUserAndTeamIdentifiers = function resolveUserAndTeamIdentifiers(_ref, _ref2) {
  var deviceId = _ref.deviceId,
      utk = _ref.utk,
      email = _ref.email,
      hubId = _ref.hubId;
  var allowUnauthed = _ref2.allowUnauthed,
      isExternalHost = _ref2.isExternalHost;
  var anon;
  var user;
  var team;

  if (hubId) {
    team = hubId;
  }

  if (email) {
    user = "EMAIL:::" + email + ":::" + accountId;
  } else if (utk) {
    if (isExternalHost) {
      anon = "TEMP_ID:::" + utk + ":::" + accountId;
    } else {
      anon = "VISITOR:::" + utk + ":::" + accountId;
    }
  } else if (deviceId) {
    anon = "TEMP_ID:::" + deviceId + ":::" + accountId;
  }

  if (!anon && !user) {
    throw eventError('Could not identify user. Please specify either an email address or __hstc cookie identifer.');
  }

  if (!allowUnauthed) {
    if (!user) {
      throw eventError('Could not identify user. Please specify an email address.');
    }

    if (!team) {
      throw eventError('Could not identify hub. Please specify a hubId.');
    }
  }

  return {
    user: user || anon,
    team: team
  };
};

var parseUtk = function parseUtk(hstc) {
  var utk;

  if (hstc) {
    var hstcParts = hstc.split('.');

    if (hstcParts.length > 1) {
      utk = hstcParts[1];
    }
  }

  return utk;
};

export var createIdentifiers = function createIdentifiers(_ref3, _ref4) {
  var email = _ref3.email,
      userId = _ref3.userId,
      hubId = _ref3.hubId,
      hstc = _ref3.hstc,
      deviceId = _ref3.deviceId;
  var allowUnauthed = _ref4.allowUnauthed,
      isExternalHost = _ref4.isExternalHost;
  var utk = parseUtk(hstc);

  var _resolveUserAndTeamId = resolveUserAndTeamIdentifiers({
    deviceId: deviceId,
    utk: utk,
    email: email,
    hubId: hubId
  }, {
    allowUnauthed: allowUnauthed,
    isExternalHost: isExternalHost
  }),
      user = _resolveUserAndTeamId.user,
      team = _resolveUserAndTeamId.team;

  return {
    user: user,
    team: team,
    utk: utk,
    raw: {
      email: email,
      userId: userId,
      hubId: hubId,
      hstc: hstc,
      deviceId: deviceId
    }
  };
};