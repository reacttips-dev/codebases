"use strict";

var WILDCARD = "*";
var EXCEPTION = "!";

function lookUp(trie, hostname) {
  var domains = hostname.split(".").reverse();
  var tlds = [];
  var currentTrie = trie;

  for (var i = 0; i < domains.length; i++) {
    var domain = domains[i];
    var isWildcardRule = currentTrie.has(WILDCARD);

    if (isWildcardRule) {
      if (currentTrie.has(EXCEPTION + domain) === false) {
        tlds.push(domain);
      }

      break;
    }

    if (currentTrie.has(domain) === false) {
      break;
    }

    tlds.push(domain);
    var value = currentTrie.get(domain);

    if (value === true) {
      break;
    }

    currentTrie = value;
  }

  return tlds.length === 0 ? null : tlds.reverse().join(".");
}

module.exports = lookUp;