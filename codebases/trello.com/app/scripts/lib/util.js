/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS203: Remove `|| {}` from converted for-own loops
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Util;
const $ = require('jquery');
const { Key } = require('@trello/keybindings');
const _ = require('underscore');
const parseURL = require('url-parse');
const Promise = require('bluebird');
const {
  tryToExcludeEXIFRotated,
  preferScaledPreviews,
  smallestPreviewBiggerThan,
  previewBetween,
  biggestPreview,
  smallestPreview,
  smallestPreviewBetween,
} = require('@trello/image-previews');
const { usesEnglish } = require('@trello/locale');

const BROWSER_SUPPORTS_REPEAT = String.prototype.repeat;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
function __range__(left, right, inclusive) {
  const range = [];
  const ascending = left < right;
  const end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}

module.exports.Util = Util = {
  spacing: 16384, // 2^14

  capitalize(val) {
    if (_.isString(val) && !_.isEmpty(val)) {
      return val[0].toUpperCase() + val.substr(1);
    } else {
      return val;
    }
  },

  pluralize(val) {
    return `${val}s`;
  },

  imageFileExtensions: ['png', 'gif', 'jpg', 'jpeg', 'bmp', 'ico'],

  extensionIsImage(fileName) {
    let needle;
    return (
      (needle = __guard__(Util.fileExt(fileName), (x) => x.toLowerCase())),
      Array.from(Util.imageFileExtensions).includes(needle)
    );
  },

  fileExt(val) {
    let left;
    return (left = __guard__(
      __guard__(/\.([a-z0-9]+)$/i.exec(val), (x1) => x1[1]),
      (x) => x.toLowerCase(),
    )) != null
      ? left
      : null;
  },

  traverse(obj, path) {
    if (_.isEmpty(path) || !obj) {
      return obj;
    }

    if (_.isArray(path)) {
      for (const key of Array.from(path)) {
        obj = obj[key];
        if (!obj) {
          break;
        }
      }

      return obj;
    } else {
      return obj[path];
    }
  },

  // via http://simonwillison.net/2006/Jan/20/escape/
  escapeForRegex(text) {
    return text != null
      ? text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&')
      : undefined;
  },

  makeSlug(s, sep) {
    let slug;
    if (sep == null) {
      sep = '-';
    }
    if (s) {
      slug = Util.removeAccents(s.toLowerCase())
        .replace(/[^a-z0-9]+/gi, sep)
        .replace(new RegExp(`^${sep}|${sep}$`, 'g'), '');

      if (slug.length > 128) {
        slug = slug.substr(0, 128);
      }
    }

    return slug || sep;
  },

  removeAccents(s) {
    // NOTE: If this starts to get too complicated, we might consider using
    // a unicode normalization library
    return s
      .replace(/[àáâãäåāăą]/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/[çćĉċč]/g, 'c')
      .replace(/[ďđ]/g, 'd')
      .replace(/[èéêëēĕėęě]/g, 'e')
      .replace(/[ĝğġģ]/g, 'g')
      .replace(/[ĥħ]/g, 'h')
      .replace(/[ìíîïĩīĭįı]/g, 'i')
      .replace(/[ñńņňŉŋ]/g, 'n')
      .replace(/[òóôõöōŏő]/g, 'o')
      .replace(/œ/g, 'oe')
      .replace(/ř/g, 'r')
      .replace(/[śŝşš]/g, 's')
      .replace(/ß/g, 'ss')
      .replace(/[ùúûüũūŭůűų]/g, 'u')
      .replace(/[ýÿ]/g, 'y');
  },

  getTime() {
    if (
      (typeof performance !== 'undefined' && performance !== null
        ? performance.now
        : undefined) != null
    ) {
      return performance.now();
    } else {
      return +new Date();
    }
  },

  getMs({ days, hours, minutes, seconds, ms, years, months, weeks }) {
    if (days == null) {
      days = 0;
    }
    if (hours == null) {
      hours = 0;
    }
    if (minutes == null) {
      minutes = 0;
    }
    if (seconds == null) {
      seconds = 0;
    }
    if (ms == null) {
      ms = 0;
    }

    if (years) {
      days += years * 365;
    }
    if (months) {
      days += months * 30;
    }
    if (weeks) {
      days += weeks * 7;
    }

    hours += days * 24;
    minutes += hours * 60;
    seconds += minutes * 60;

    ms += seconds * 1000;
    return ms;
  },

  getSeconds(args) {
    return this.getMs(args) / 1000;
  },

  dateAfter(args) {
    const date =
      (args != null ? args.date : undefined) != null
        ? args != null
          ? args.date
          : undefined
        : new Date();
    return new Date(date.getTime() + this.getMs(args));
  },

  dateBefore(args) {
    const date =
      (args != null ? args.date : undefined) != null
        ? args != null
          ? args.date
          : undefined
        : new Date();
    return new Date(date.getTime() - this.getMs(args));
  },

  compareMemberType(board, memberA, memberB, opts) {
    let hierarchy;
    if (opts == null) {
      opts = {};
    }
    let { mode } = opts;
    if (mode == null) {
      mode = 'standard';
    }

    switch (mode) {
      case 'members':
        hierarchy = [['normal', 'admin']];
        break;
      case 'commentDelete':
        hierarchy = [['normal', 'org', 'observer'], ['admin']];
        break;
      default:
        hierarchy = [['org'], ['normal'], ['admin']];
    }

    const getHierarchyLevel = function (member) {
      const memberType = board.getMemberType(member);

      // Find the index of the group that this member's memberType is in.
      // (A group may contain multiple member types, e.g. in 'members' mode)
      for (let index = 0; index < hierarchy.length; index++) {
        const group = hierarchy[index];
        if (Array.from(group).includes(memberType)) {
          return index;
        }
      }

      return -1;
    };

    // NOTE: If their memberType isn't in the list, it will be -1, which is lower than everything
    const memberALevel = getHierarchyLevel(memberA);
    const memberBLevel = getHierarchyLevel(memberB);

    if (memberALevel > memberBLevel) {
      return 1;
    } else if (memberALevel < memberBLevel) {
      return -1;
    } else {
      return 0;
    }
  },

  idToDate(id) {
    return new Date(
      1000 * parseInt(id != null ? id.substr(0, 8) : undefined, 16),
    );
  },

  tryToExcludeEXIFRotated,
  preferScaledPreviews,
  smallestPreviewBiggerThan,
  previewBetween,
  smallestPreviewBetween,
  biggestPreview,
  smallestPreview,

  // Move items from the end of an array to the beginning, and vice versa.
  // Example: rotateArr([1, 2, 3], 1)  === [3, 1, 2]
  //          rotateArr([1, 2, 3], -1) === [2, 3, 1]
  rotateArr(arr, shift) {
    return _.flatten([arr.slice(-shift), arr.slice(0, -shift)], true);
  },

  stopPropagation(e) {
    return e != null ? e.stopPropagation() : undefined;
  },

  preventDefault(e) {
    return e != null ? e.preventDefault() : undefined;
  },

  stop(e) {
    Util.stopPropagation(e);
    return Util.preventDefault(e);
  },

  // email

  checkEmail(email, additionalChars) {
    if (additionalChars == null) {
      additionalChars = '';
    }
    return new RegExp(
      `\
^\
[^"@\\s\\[\\]\\(\\),:;<>\\\\]+\
@\
[-a-z0-9\\.${additionalChars}]+\
\\.\
[a-z${additionalChars}]+\
$\
`,
      'i',
    ).test(email);
  },

  removeDomainFromEmailAddress(email, additionalChars) {
    if (additionalChars == null) {
      additionalChars = '';
    }
    return email.replace(
      new RegExp(`\
@\
[-a-z0-9\\.${additionalChars}]+\
\\.\
[a-z${additionalChars}]+\
$\
`),
      '',
    );
  },

  validName(name) {
    return name.length >= 1;
  },

  spaces(count) {
    if (!this.longStr) {
      this.longStr = ' ';
    }

    while (this.longStr.length < count) {
      this.longStr = this.longStr + this.longStr;
    }

    return this.longStr.substr(0, count);
  },

  _pad(str, len, padChr, leftPad) {
    // Pad doesn't make much sense on non-strings, does it?
    if (padChr == null) {
      padChr = ' ';
    }
    str = str.toString();

    if (str.length > len) {
      return str.substr(0, len);
    } else {
      let padding;
      const amtPadding = len - str.length;
      if (BROWSER_SUPPORTS_REPEAT) {
        padding = padChr.repeat(amtPadding);
      } else {
        // Optimize for spaces, since that's most common and str concat is expensive
        padding =
          padChr === ' '
            ? this.spaces(amtPadding)
            : this.times(padChr, amtPadding);
      }

      if (leftPad) {
        return padding + str;
      } else {
        return str + padding;
      }
    }
  },

  rpad(str, len, padChr) {
    return this._pad(str, len, padChr, false);
  },

  lpad(str, len, padChr) {
    return this._pad(str, len, padChr, true);
  },

  times(str, times) {
    return _.map(__range__(0, times, false), () => str).join('');
  },

  truncate(s, len) {
    if (!(s != null ? s.length : undefined) || s.length < len) {
      return s;
    } else {
      // Try to break at a space
      const truncated = s.substr(0, s.lastIndexOf(' ', len));
      if (truncated) {
        return truncated;
      } else {
        // Whoops, we would have displayed nothing
        return s.substr(0, len);
      }
    }
  },

  usesEnglish,

  scrollToTop() {
    return $(window).scrollTop(0);
  },

  getProtocol(url) {
    let left;
    if (!url) {
      return '';
    }
    return (left = __guard__(
      new RegExp(`^([a-z]+):`, 'i').exec(url),
      (x) => x[1],
    )) != null
      ? left
      : '';
  },

  makeHttp(url) {
    if (!url) {
      return '';
    }
    url = url.replace(/^[a-z]*:\/*/i, '');
    return `http://${url}`;
  },

  sanitizeWebAddress(url) {
    let needle;
    if (
      ((needle = Util.getProtocol(url)), !['http', 'https'].includes(needle))
    ) {
      return Util.makeHttp(url);
    } else {
      return url;
    }
  },

  isInPosition(index, allItems, item) {
    if ((item != null ? item.id : undefined) == null) {
      return false;
    }
    const itemAtPosition = allItems[index];
    return (itemAtPosition != null ? itemAtPosition.id : undefined) === item.id;
  },

  calcPos(index, allItems, item, fxFilter, includeItem) {
    const indexStep = 65536; // 2^16
    const items = allItems.select(
      (c) =>
        (!(item != null && item.id === c.id) || includeItem) &&
        (!fxFilter || fxFilter(c)),
    );

    // if the item is in position no point in moving it around
    if (Util.isInPosition(index, items, item)) {
      return item.pos != null ? item.pos : item.get('pos');
    }

    const indexBounded = Math.min(Math.max(index, 0), items.length);

    const itemPrev = items[indexBounded - 1];
    const itemNext = items[indexBounded];

    const posItemCurr = (item != null ? item.get('pos') : undefined) || -1;

    const posItemPrev = itemPrev != null ? itemPrev.get('pos') : -1;
    const posItemNext = itemNext != null ? itemNext.get('pos') : -1;

    if (posItemNext === -1) {
      // Ensure that the new pos comes after the prev card pos
      if (item && posItemCurr > posItemPrev) {
        // it's already after so no need to update
        return posItemCurr;
      } else {
        // bump it one past the last item
        return posItemPrev + indexStep;
      }
    } else {
      if (item && posItemCurr > posItemPrev && posItemCurr < posItemNext) {
        return posItemCurr;
      } else if (posItemPrev >= 0) {
        return (posItemNext + posItemPrev) / 2;
      } else {
        // halve the pos of the top item
        return posItemNext / 2;
      }
    }
  },

  randomWait(wait, spread) {
    return Math.floor(wait + Math.random() * spread);
  },

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  },

  calcBoardLayout() {
    return $(window).trigger('resize');
  },

  // nav menu list

  navMenuList(parentEl, item, key) {
    let elem, nextEl, prevEl;
    const items = parentEl.find(item);

    const selectedEl = items.filter('.selected').first()[0];
    const sIndex = _.indexOf(items, selectedEl);

    const firstEl = items[0];
    const lastEl = items[items.length - 1];

    if (sIndex - 1 < 0) {
      prevEl = lastEl;
    } else {
      prevEl = items[sIndex - 1];
    }

    if (sIndex + 1 > items.length) {
      nextEl = firstEl;
    } else {
      nextEl = items[sIndex + 1];
    }

    if (key === Key.ArrowDown) {
      elem = nextEl;
    }

    if (key === Key.ArrowUp) {
      elem = prevEl;
    }

    return this.selectMenuItem(parentEl, item, elem);
  },

  selectMenuItem(parentEl, items, elem) {
    parentEl.find(items).removeClass('selected');
    return $(elem).addClass('selected');
  },

  // selection

  insertSelection(textarea, newtext, start, end) {
    let after, before, separator;
    textarea = Util.getElem(textarea);
    const $textarea = $(textarea);
    const val = $textarea.val();

    if (start != null || end != null) {
      before = val.substring(0, start);
      after = val.substring(end);
      this.setCaretPosition(textarea, start + `${newtext}`.length);
    } else {
      before = val;
      after = '';
    }

    if (/\S$/.test(before)) {
      separator = ' ';
    } else {
      separator = '';
    }

    $textarea.val(before + separator + newtext + after);
    this.setCaretPosition(
      textarea,
      before.length + separator.length + newtext.length,
    );

    $textarea.focus();
    return $textarea.trigger('mutated');
  },

  _nextWhitespace(val, idx) {
    let nextBreak = val.indexOf('\n', idx);
    if (nextBreak === -1) {
      nextBreak = Infinity;
    }
    let nextSpace = val.indexOf(' ', idx);
    if (nextSpace === -1) {
      nextSpace = Infinity;
    }

    return Math.min(nextBreak, nextSpace, val.length);
  },

  // Find the word from the previous word break up until the cursor
  getWordFromIndex(val = '', idx) {
    // get the most recent word break
    let start = Math.max(
      val.lastIndexOf('\n', idx - 1),
      val.lastIndexOf(' ', idx - 1),
    );
    start += 1;

    // trim obvious punctuation from the start of the word
    // handle : specially since it can be used for emoji, but we don't want it
    // to interfere with @mentions (e.g. cc:@someone)
    while (/[()[\]/\\;"'&]|:@/.test(val[start])) {
      start++;
    }

    const end = idx;

    const length = end - start;
    const str = val.slice(start, end);

    return {
      start,
      end,
      length,
      str,
    };
  },

  getWordFromCaret(textarea) {
    textarea = Util.getElem(textarea);

    const val = $(textarea).val();
    const idx = this.getCaretPosition(textarea);

    return this.getWordFromIndex(val, idx);
  },

  getLineFromIndex(val, idx) {
    // get the most recent line break
    let start = val.lastIndexOf('\n', idx - 1);
    start += 1;

    const end = this._nextWhitespace(val, idx);

    const length = end - start;
    const str = val.slice(start, end);

    return {
      start,
      end,
      length,
      str,
    };
  },

  getLineFromCaret(textarea) {
    textarea = Util.getElem(textarea);

    const val = $(textarea).val();
    const idx = this.getCaretPosition(textarea);

    return this.getLineFromIndex(val, idx);
  },

  getCaretPosition(textarea) {
    let caretPos;
    textarea = Util.getElem(textarea);

    if (textarea?.selectionStart != null) {
      caretPos = textarea.selectionStart;
    } else if (Array.from(document).includes('selection')) {
      //IE support
      textarea.focus();
      const selection = document.selection.createRange();
      const selectionLength = document.selection.createRange().text.length;
      selection.moveStart('character', -textarea.value.length);
      caretPos = selection.text.length - selectionLength;
    }

    return caretPos;
  },

  setCaretPosition(ctrl, pos) {
    ctrl = Util.getElem(ctrl);

    if (ctrl.setSelectionRange) {
      ctrl.focus();
      return ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      return range.select();
    }
  },

  setCaretAtEnd(input) {
    if (input) {
      const end = $(input).val().length;
      return this.setCaretPosition(input, end);
    }
  },

  getLastWord(textarea) {
    const terms = $(textarea).val().split(' ');
    return _.last(terms);
  },

  removeWordAtIndex(val, idx) {
    const word = Util.getWordFromIndex(val, idx);
    const first = val.slice(0, word.start);
    const last = val.slice(word.end);
    return first + last;
  },

  stripExtraSpaces(string) {
    return string != null ? string.replace(/\s+/g, ' ').trim() : undefined;
  },

  // members

  getMemNameArray(mem) {
    return _.chain(['username', 'fullName', 'initials', 'email'])
      .map((attr) =>
        __guard__(mem.get(attr), (x) => x.toLowerCase().split(/\s+/)),
      )
      .compact()
      .flatten()
      .value();
  },

  getMemNameArrayFromId(modelCache, id) {
    let mem;
    if ((mem = modelCache.get('Member', id)) != null) {
      return this.getMemNameArray(mem);
    } else {
      return [];
    }
  },

  filterMembers(modelCache, term, idMems) {
    const termRe = new RegExp(`^${Util.escapeForRegex(term)}`, 'i');

    const idMatchMems = [];
    for (const memId of Array.from(idMems)) {
      const splitNames = Util.getMemNameArrayFromId(modelCache, memId);
      if (_.find(splitNames, (name) => termRe.test(name))) {
        idMatchMems.push(memId);
      }
    }

    return idMatchMems;
  },

  getQueryParameter(name, defaultValue) {
    let left;
    if (defaultValue == null) {
      defaultValue = '';
    }
    const paramRegex = new RegExp(`[?&]${name}=([^?&]*)`);
    const match =
      (left = paramRegex.exec(location.search)) != null
        ? left
        : paramRegex.exec(location.hash);
    const value = match != null ? match[1] : undefined;
    if (value != null) {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    } else {
      return defaultValue;
    }
  },

  validFileSize(file, limit) {
    if (limit == null) {
      limit = 10 * 1024 * 1024;
    }
    return (file != null ? file.size : undefined) < limit;
  },

  uploadFile(token, input, next) {
    const name = _.uniqueId('iframe');

    const elIframe = $('<iframe>')
      .attr('name', name)
      .css('display', 'none')
      .appendTo('body')
      .load(function (e) {
        let response;
        _.defer(() => elIframe.remove());
        try {
          response = elIframe.contents().text();
        } catch (error) {
          // If we're in IE and the response is anything other than 200, the iframe
          // ends up in a different security domain and we can't read its contents
          return next('File too large');
        }
        if (/File too large/i.test(response)) {
          return next(response);
        } else {
          return next();
        }
      });

    input
      .closest('form')
      .attr('target', name)
      .find('input[name=token]')
      .val(token)
      .end()
      .submit();

    return _.defer(() => input.val(''));
  },

  hasValidInviteTokenFor(model, member) {
    const inviteToken = this.inviteTokenFor(model.id);
    if (inviteToken == null) {
      return false;
    }

    if (
      member &&
      member.isLoggedIn() &&
      member.get('id') !== inviteToken.split('-')[0]
    ) {
      return false;
    }

    const ghostMember = model.modelCache.get(
      'Member',
      inviteToken.split('-')[0],
    );
    if (ghostMember == null) {
      return false;
    }
    if (model.getMemberType(ghostMember) === 'virtual') {
      return true;
    }

    return model.isMember(ghostMember) && model.get('memberType') === 'ghost';
  },

  inviteTokenFor(idModel) {
    return $.cookie(`invite-token-${idModel}`);
  },

  invitationTokens() {
    const inviteRegex = /invite-token-[-a-f0-9]*/g;
    return (() => {
      let cookieName;
      const result = [];
      while (
        (cookieName = __guard__(
          inviteRegex.exec(document.cookie),
          (x) => x[0],
        )) != null
      ) {
        result.push($.cookie(cookieName));
      }
      return result;
    })();
  },

  // Normalize an input parameter to
  getElem(jqOrElem) {
    if (jqOrElem instanceof $) {
      return jqOrElem[0];
    } else {
      return jqOrElem;
    }
  },

  // A polyfill for getting transforms objects. It's not possible to get
  // individual parts of a transform like scale, rotate, translate, etc. so we
  // have to get the whole transform matrix then get individual parts.
  getElemTransformMatrix(elem) {
    const matrix =
      elem.css('-webkit-transform') ||
      elem.css('-moz-transform') ||
      elem.css('-ms-transform') ||
      elem.css('-o-transform') ||
      elem.css('transform');

    // JavaScript returns a "none" string if there is not transform... so
    // let's return null instead so we can check for existence later.
    if (matrix !== 'none') {
      return matrix;
    } else {
      return null;
    }
  },

  getMatrixDegrees(matrix) {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const [a, b] = values;
    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
  },

  getMatrixScale(matrix) {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const [a, b] = values;
    return Math.sqrt(a * a + b * b);
  },

  getDegrees(y, x) {
    return Math.round(Math.atan2(y, x) * (180 / Math.PI));
  },

  getPositiveDegrees(y, x) {
    return (Util.getDegrees(y, x) + 360) % 360;
  },

  // http://jsfiddle.net/chriscoyier/t5Kts/
  calcDistanceFromCenter(elem, mouseX, mouseY) {
    const distanceSquared =
      Math.pow(mouseX - (elem.offset().left + elem.width() / 2), 2) +
      Math.pow(mouseY - (elem.offset().top + elem.height() / 2), 2);

    return Math.floor(Math.sqrt(distanceSquared));
  },

  // Help the Garbage Collector out by detatching everything from the object
  // We wait a bit (for all the callbacks, etc to fire) to avoid any issues
  // with callbacks that might be firing at the same time as our transition
  _runShredders() {
    const shredders = Util._shredders;
    const now = new Date();
    Util._shredders = [];
    for (const entry of Array.from(shredders)) {
      if (now > entry.time) {
        entry.fn();
      } else {
        Util._shredders.push(entry);
      }
    }

    Util._shredTimeout = null;
    return Util._startShredTimer();
  },

  _startShredTimer() {
    if (!Util._shredTimeout && Util._shredders.length > 0) {
      return Util._shredTimeout != null
        ? Util._shredTimeout
        : (Util._shredTimeout = setTimeout(
            Util._runShredders,
            Util.getMs({ seconds: 3 }),
          ));
    }
  },

  shred(obj) {
    if (Util._shredders == null) {
      Util._shredders = [];
    }
    Util._shredders.push({
      time: Util.dateAfter({ seconds: 20 }),
      fn: () => {
        return (() => {
          const result = [];
          for (const key of Object.keys(obj || {})) {
            result.push(delete obj[key]);
          }
          return result;
        })();
      },
    });

    return Util._startShredTimer();
  },

  relativeUrl(url) {
    return url.replace(new RegExp(`^[a-z]+://[^/]+`), '');
  },

  isTextElement(el) {
    // Because input[type=text] and input[type=submit] are both instances of
    // HTMLInputElement, the spec requires that accessing the properties of
    // non-text type inputs throw an exception, and provides no way to detect
    // whether the element is actually textual. We attempt to short-circuit
    // for common known types, but to support new input types being added or
    // unknown types falling back to text input, the final word is hacky
    // exception testing.
    // See http://www.w3.org/TR/html5/forms.html#textFieldSelection

    if (el instanceof HTMLTextAreaElement) {
      return true;
    }

    if (!(el instanceof HTMLInputElement)) {
      return false;
    }

    if (['text', 'email', 'password', 'search'].includes(el.type)) {
      return true;
    }

    if (['submit', 'reset', 'button', 'checkbox'].includes(el.type)) {
      return false;
    }

    try {
      el.selectionStart;
      return true;
    } catch (error) {
      return false;
    }
  },

  withoutAlteringSelection(body) {
    const { activeElement } = document;
    const $activeElement = $(activeElement);
    const focused = $activeElement.is(':focus');
    if (activeElement != null && Util.isTextElement(activeElement)) {
      let direction, end, start, startCompatibility;
      if (activeElement.selectionStart) {
        start = activeElement.selectionStart;
        end = activeElement.selectionEnd;
        direction = activeElement.selectionDirection;
      } else {
        startCompatibility = this.getCaretPosition(activeElement);
      }
      body();
      if (start) {
        activeElement.setSelectionRange(start, end, direction);
      } else if (startCompatibility) {
        this.setCaretPosition(activeElement, startCompatibility);
      }

      if (focused) {
        $activeElement.focus();
      }
    } else {
      body();
    }
  },

  waitForImageLoad(url) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(img);
      return (img.src = url);
    });
  },

  // Sort members alphabetically, with a special member first
  sortMembers(members, first) {
    const isFirst = (memberLikeThing) =>
      memberLikeThing === first || memberLikeThing.id === first.get('id');
    members.sort(function (memA, memB) {
      const aFirst = isFirst(memA);
      const bFirst = isFirst(memB);
      if (aFirst && !bFirst) {
        return -1;
      } else if (!aFirst && bFirst) {
        return 1;
      } else if (memA.fullName < memB.fullName) {
        return -1;
      } else if (memA.fullName > memB.fullName) {
        return 1;
      } else {
        return 0;
      }
    });
    return members;
  },

  // due date stuff
  firstLessThan(n, dispatch) {
    for (const entry of Array.from(dispatch)) {
      if (_.isArray(entry)) {
        const [cutoff, val] = Array.from(entry);
        if (n <= cutoff) {
          if (_.isFunction(val)) {
            return val.call(this, n);
          } else {
            return val;
          }
        }
      } else {
        if (_.isFunction(entry)) {
          return entry.call(this, n);
        } else {
          return entry;
        }
      }
    }
  },

  hoursLeft(date) {
    return (new Date(date) - new Date()) / Util.getMs({ hours: 1 });
  },

  escapedReturnUrl() {
    return encodeURIComponent(
      location.href.replace(new RegExp(`^https?://[^/]+`), ''),
    );
  },

  // Determine if a URL is not part of the web client
  isExternalURL(url) {
    const parsed = parseURL(url);
    // A mismatched host is obviously external; also reject anything that
    // looks like it might be an attempt at a protocol relative URL
    // (i.e. two //, or something tricky like /\)  Also consider anything
    // with a /. or .. in it to be external
    return (
      parsed.host !== document.location.host ||
      new RegExp(`^[\\\\/.]{2,}`).test(parsed.pathname)
    );
  },

  reverse(array) {
    return array.slice(0).reverse();
  },

  buildFuzzyMatcher(query) {
    const searchExpressions = _.map(
      query.split(/\s+/),
      (word) => new RegExp(`${Util.escapeForRegex(word)}`, 'i'),
    );
    return (input) =>
      _.every(searchExpressions, (searchExpression) =>
        searchExpression.test(input),
      );
  },

  getPadding(el) {
    const paddings = $(el).css([
      'padding-left',
      'padding-top',
      'padding-bottom',
      'padding-right',
    ]);
    return {
      left: parseInt(paddings['padding-left'], 10),
      top: parseInt(paddings['padding-top'], 10),
      bottom: parseInt(paddings['padding-bottom'], 10),
      right: parseInt(paddings['padding-right'], 10),
    };
  },

  frameInCoordinateSpace(childEl, parentEl) {
    const parentPadding = Util.getPadding(parentEl);
    const childFrame = {
      top: childEl.offsetTop - (parentEl.offsetTop + parentPadding.top),
      left: childEl.offsetLeft - (parentEl.offsetLeft + parentPadding.left),
    };
    childFrame.bottom = childFrame.top + childEl.clientHeight;
    childFrame.right = childFrame.left + childEl.clientWidth;
    return childFrame;
  },

  getBounds(el) {
    const $el = $(el);
    const bounds = {
      left: $el.scrollLeft(),
      top: $el.scrollTop(),
      width: $el.innerWidth(),
      height: $el.innerHeight(),
    };
    bounds.bottom = bounds.top + bounds.height;
    bounds.right = bounds.left + bounds.width;
    return bounds;
  },

  scrollElementIntoView(parentEl, childEl, param) {
    if (param == null) {
      param = {};
    }
    const { horizontal, vertical, animated } = param;
    const parentBounds = Util.getBounds(parentEl);
    const parentPadding = Util.getPadding(parentEl);
    const childFrame = Util.frameInCoordinateSpace(childEl, parentEl);
    const frameWeWantVisible = {
      top: childFrame.top - parentPadding.top,
      bottom: childFrame.bottom + parentPadding.bottom,
      left: childFrame.left - parentPadding.left,
      right: childFrame.right + parentPadding.right,
    };

    const set = (() => {
      if (animated) {
        const $parentEl = $(parentEl);
        return function (prop, val) {
          const map = {};
          map[prop] = val;
          return $parentEl.animate(map, { duration: 150, queue: false });
        };
      } else {
        return (prop, val) => (parentEl[prop] = val);
      }
    })();

    if (vertical) {
      const scrollVertical = (top) => set('scrollTop', top + parentPadding.top);
      if (frameWeWantVisible.bottom > parentBounds.bottom) {
        scrollVertical(frameWeWantVisible.bottom - parentBounds.height);
      } else if (frameWeWantVisible.top < parentBounds.top) {
        scrollVertical(frameWeWantVisible.top);
      }
    }
    if (horizontal) {
      const scrollHorizontal = (left) =>
        set('scrollLeft', left + parentPadding.left);
      if (frameWeWantVisible.right > parentBounds.right) {
        scrollHorizontal(frameWeWantVisible.right - parentBounds.width);
      } else if (frameWeWantVisible.left < parentBounds.left) {
        scrollHorizontal(frameWeWantVisible.left);
      }
    }
  },

  loadScript(url) {
    return new Promise(function (resolve, reject) {
      const scriptEl = document.createElement('script');
      scriptEl.async = true;
      scriptEl.src = url;
      scriptEl.onload = resolve;
      scriptEl.onerror = reject;
      return document.querySelector('head').appendChild(scriptEl);
    });
  },

  isJsonString(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    } finally {
      true;
    }
  },

  calculateBrightness(hex) {
    // Ignoring the leading # character.
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    // As defined in https://www.w3.org/TR/AERT/#color-contrast
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness > 127.5) {
      return 'light';
    }

    return 'dark';
  },
};
