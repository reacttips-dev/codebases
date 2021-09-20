/* eslint-disable
    default-case,
    eqeqeq,
    no-prototype-builtins,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
Drag and Drop is still a mess; here we attempt to provide a consistent way to
get the types of items that are being dragged and the types and content of
items that are dropped

State of Drag and Drop for supported browsers:

Chrome

- Things you can drag: Files, Urls, Text
- How you get the types of things being dragged: e.dataTransfer.item[].type
- How you get the content that was dropped: e.dataTransfer.item.getAsString or
  e.dataTransfer.getData()

Firefox

- Things you can drag: Files, Urls, Text
- How you get the types of things being dragged: e.dataTransfer.types
- How you get the content that was dropped: e.dataTransfer.getData()

Internet Explorer / Edge

- Things you can drag: Files, Urls, Text
  (Text may not work in some cases unless you've enabled "Allow dragging of
  content between domains into separate windows")
- How you get the types of things being dragged: e.dataTransfer.types
- How you get the content that was dropped: e.dataTransfer.getData()

Safari

- Things you can drag: Files, Urls
- How you get the types of things being dragged: e.dataTransfer.types, although
  there isn't a good way to detect this
- How you get the content that was dropped: e.dataTransfer.getData()
*/

const Promise = require('bluebird');
const _ = require('underscore');
const { isUrl } = require('app/scripts/lib/util/url/is-url');

// Chrome has dataTransfer.items; you can figure out the type by looking at
// the item.kind and item.type
const getTypeFromItem = function (item) {
  const knownType = (() => {
    switch (item.kind) {
      case 'file':
        return 'files';
      case 'string':
        switch (item.type) {
          case 'text/uri-list':
            return 'url';
          case 'text/plain':
            return 'text';
        }
        break;
    }
  })();

  return knownType || 'unknown';
};

// Chrome has dataTransfer.items
const getTypesUsingItems = (dataTransfer) =>
  _.chain(dataTransfer.items).map(getTypeFromItem).compact().uniq().value();
// IE uses types like Files/Url/Text
// Firefox uses things that look like mime types, and also the IE ones
// Safari includes text/uri-list for links
const getTypeFromType = function (type) {
  switch (type) {
    case 'Files':
    case 'application/x-moz-file':
      return 'files';
    case 'Url':
    case 'text/x-moz-url':
    case 'text/uri-list':
      return 'url';
    case 'Text':
    case 'text/plain':
      return 'text';
    default:
      return 'unknown';
  }
};

// Map the browser types to our simple types (files, url, text)
const getTypesUsingTypes = (dataTransfer) =>
  _.chain(dataTransfer.types).map(getTypeFromType).compact().uniq().value();
// If dataTransfer.files isn't empty, we're dragging files
const getTypesUsingFiles = function (dataTransfer) {
  if (dataTransfer.files.length > 0) {
    return ['files'];
  } else {
    return [];
  }
};

// Chrome has dataTransfer.items
const getDroppedUsingItems = (dataTransfer) =>
  // [MAPPING]
  Promise.all(
    _.toArray(dataTransfer.items).map(function (item) {
      const type = getTypeFromItem(item);

      if (['text', 'url'].includes(type)) {
        return new Promise(function (resolve) {
          return item.getAsString((content) => resolve({ type, content }));
        });
      } else if (type === 'files') {
        // getAsFile can actually take a while if the file is large (e.g. 20mb),
        // but we can't give any sort of message while we're thinking about it
        // because there can't be any async steps in the path between the "paste"
        // event and the getAsFile (I'm guessing it's a security precaution)
        const content = item.getAsFile();
        // It's possible the content will be null, e.g. for images copied and
        // pasted out of Outlook https://stackoverflow.com/q/59758501
        if (content) {
          return { type, content };
        } else {
          return null;
        }
      } else {
        return null;
      }
    }),
  );
// All the browsers seem to have dataTransfer.files
const getDroppedUsingFiles = (dataTransfer) =>
  _.map(dataTransfer.files, (content) => ({ type: 'files', content }));
// Firefox, Safari and IE support getData
const getDroppedUsingGetData = function (dataTransfer) {
  // Get the list of actual types, since that's what getData will expect
  let { types } = dataTransfer;
  // Unfortunately IE doesn't appear to set the types on clipboardData when
  // pasting text (types is just null)
  if (types == null) {
    types = dataTransfer.getData('Text') ? ['Text'] : [];
  }

  return _.map(types, function (type) {
    let content;
    const simpleType = getTypeFromType(type);
    if (
      ['text', 'url'].includes(simpleType) &&
      (content = dataTransfer.getData(type))
    ) {
      return {
        type: simpleType,
        content,
      };
    } else {
      return null;
    }
  });
};

// Given a DataTransfer (from a drop event or a paste event) return a normalized
// map of files/text/url
const contentFromDataTransfer = (dataTransfer) =>
  // [MAPPING]
  Promise.all(droppedGetters.map((getter) => getter(dataTransfer))).then(
    (dropped) =>
      _.chain(dropped)
        .flatten()
        .compact()
        .each(function (entry) {
          if (entry.type === 'text' && isUrl(entry.content)) {
            entry.type = 'url';
          }
        })
        .reject(
          (entry) =>
            // e.g. file:// is considered a URL but we can't do anything with those
            entry.type === 'url' && !isUrl(entry.content),
        )
        .groupBy('type')
        .mapObject(function (values, key) {
          // For files we give an array of the File objects, for everything else
          // (text and urls) we assume there's only one thing
          if (key === 'files') {
            return _.pluck(values, 'content');
          } else {
            return values[0].content;
          }
        })
        .value(),
  );
const isMacSafari = () =>
  /mac/i.test(navigator.platform) && /safari/i.test(navigator.userAgent);

// Attempt to do some basic feature detection by looking at what's defined on
// the DataTransfer prototype
const hasSupport = function (propertyName) {
  // Older versions of safari (pre 7.1) used the Clipboard type for drag events
  const DataTransferType = window.DataTransfer || window.Clipboard;
  // We don't know what type is used for drag/drop events, so we can't do
  // feature detection
  if (!DataTransferType) {
    return false;
  }

  return (
    DataTransferType.prototype.hasOwnProperty(propertyName) ||
    // There doesn't seem to be a way to see that Safai includes types on their
    // event.dataTransfer
    (propertyName === 'types' && isMacSafari()) ||
    // ... (and pre 7.1 safari doesn't indicate that Clipboard has files)
    (!window.DataTransfer && propertyName === 'files' && isMacSafari())
  );
};

const getTypes = hasSupport('items')
  ? getTypesUsingItems
  : hasSupport('types')
  ? getTypesUsingTypes
  : hasSupport('files')
  ? getTypesUsingFiles
  : () => [];

const droppedGetters = hasSupport('items')
  ? [getDroppedUsingItems]
  : _.compact([
      hasSupport('files') ? getDroppedUsingFiles : undefined,
      hasSupport('getData') && hasSupport('types')
        ? getDroppedUsingGetData
        : undefined,
    ]);

const getDropped = (event) => contentFromDataTransfer(event.dataTransfer);

const getPasted = function (event) {
  if (event.clipboardData != null) {
    return contentFromDataTransfer(event.clipboardData);
  } else if (window.clipboardData != null) {
    // Internet Explorer
    return contentFromDataTransfer(window.clipboardData);
  } else {
    return Promise.resolve({});
  }
};

module.exports = {
  getTypes,
  getDropped,
  getPasted,
};

// [MAPPING]
//
// We can't use Promise.map here, as it will resolve the body on the next tick.
// This is bad, because on the next tick the next tick the relevant properties
// of each item will be cleared out -- item.type, for example, will just give
// you the empty string.
