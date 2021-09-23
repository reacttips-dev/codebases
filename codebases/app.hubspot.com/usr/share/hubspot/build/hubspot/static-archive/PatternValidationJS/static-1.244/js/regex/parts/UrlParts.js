/* eslint-disable */
'use es6';

var seperator = '\\.';
var blacklistedDomainChars = "\\s\\?\\#\\/\\(\\)\\=\\:\\;\\@\\\\\"" + seperator;
var protocol = '(?:(?:https?:)?\\/\\/)';
var protocolRequired = '(?:https?:\\/\\/)';
var www = "(?:www" + seperator + ")";
var domain = www + "?(?:(?:[^" + blacklistedDomainChars + "]+)" + seperator + ")+(?:[^" + blacklistedDomainChars + "]+)";
var path = '(?:(?:\\/[^\\s\\/\\#\\&\\?]*)+\\/?)';
var wildcardPath = '(?:(/(?:[%a-zA-Z0-9_-])*?)*(?:/[\\*]))';
var fileName = '(?:[%a-zA-Z0-9_-]+)';
var fileExtension = '(?:(?:\\.[%a-zA-Z0-9-]+)[^\\.\\s])';
var file = "" + fileName + fileExtension;
var invalidSearchChars = '\\s\\?\\#\\&';
var search = "(?:([\\?&#][^" + invalidSearchChars + "]*?=?([^" + invalidSearchChars + "]*))+)";
var ungroupedSearch = "(?:(?:[\\?&#][^" + invalidSearchChars + "]*?=?(?:[^" + invalidSearchChars + "]*))+)";
export default {
  www: www,
  domain: domain,
  protocol: protocol,
  protocolRequired: protocolRequired,
  path: path,
  wildcardPath: wildcardPath,
  file: file,
  fileName: fileName,
  fileExtension: fileExtension,
  search: search,
  ungroupedSearch: ungroupedSearch
};