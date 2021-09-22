/**
 * British English translation.
 *
 */
var $ = require('jquery');

('use strict');

$.fn.select2.locales['en-GB'] = {
    formatMatches: function(matches) {
        if (matches === 1) {
            return 'One result is available, press enter to select it.';
        }

        return matches + ' results are available, use up and down arrow keys to navigate.';
    },
    formatNoMatches: function() {
        return 'No matches found';
    },
    formatInputTooShort: function(input, min) {
        var n = min - input.length;

        return 'Please enter ' + n + ' or more character' + (n === 1 ? '' : 's');
    },
    formatInputTooLong: function(input, max) {
        var n = input.length - max;

        return 'Please delete ' + n + ' character' + (n === 1 ? '' : 's');
    },
    formatSelectionTooBig: function(limit) {
        return 'You can only select ' + limit + ' item' + (limit === 1 ? '' : 's');
    },
    formatLoadMore: function() {
        return 'Loading more results…';
    },
    formatSearching: function() {
        return 'Searching…';
    },
};

$.extend($.fn.select2.defaults, $.fn.select2.locales['en-GB']);
