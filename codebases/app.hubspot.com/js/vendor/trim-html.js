'use es6';
/**
 * [trimHtml description]
 * @param  {String} html
 * @param  {Object} options
 * @return {Object}
 */

export default function trimHtml(html, options) {
  options = options || {};
  var limit = options.limit || 100,
      preserveTags = typeof options.preserveTags !== 'undefined' ? options.preserveTags : true,
      wordBreak = typeof options.wordBreak !== 'undefined' ? options.wordBreak : false,
      suffix = options.suffix || '...',
      moreLink = options.moreLink || '',
      moreText = options.moreText || '»';
  var arr = html.replace(/</g, "\n<").replace(/>/g, ">\n").replace(/\n\n/g, "\n").replace(/^\n/g, "").replace(/\n$/g, "").split("\n");
  var sum = 0,
      row,
      cut,
      add,
      tagMatch,
      tagName,
      rowCut,
      tagStack = [],
      more = false;

  for (var i = 0; i < arr.length; i++) {
    row = arr[i]; // count multiple spaces as one character

    rowCut = row.replace(/[ ]+/g, ' ');

    if (!row.length) {
      continue;
    }

    if (row[0] !== "<") {
      if (sum >= limit) {
        row = "";
      } else if (sum + rowCut.length >= limit) {
        cut = limit - sum;

        if (row[cut - 1] === ' ') {
          while (cut) {
            cut -= 1;

            if (row[cut - 1] !== ' ') {
              break;
            }
          }
        } else {
          add = row.substring(cut).split('').indexOf(' '); // break on halh of word

          if (!wordBreak) {
            if (add !== -1) {
              cut += add;
            } else {
              cut = row.length;
            }
          }
        }

        row = row.substring(0, cut) + suffix;

        if (moreLink) {
          row += '<a href="' + moreLink + '" style="display:inline">' + moreText + '</a>';
        }

        sum = limit;
        more = true;
      } else {
        sum += rowCut.length;
      }
    } else if (!preserveTags) {
      row = '';
    } else if (sum >= limit) {
      tagMatch = row.match(/[a-zA-Z]+/);
      tagName = tagMatch ? tagMatch[0] : '';

      if (tagName) {
        if (row.substring(0, 2) !== '</') {
          tagStack.push(tagName);
          row = '';
        } else {
          while (tagStack[tagStack.length - 1] !== tagName && tagStack.length) {
            tagStack.pop();
          }

          if (tagStack.length) {
            row = '';
          }

          tagStack.pop();
        }
      } else {
        row = '';
      }
    }

    arr[i] = row;
  }

  return {
    html: arr.join("\n").replace(/\n/g, ""),
    more: more
  };
}