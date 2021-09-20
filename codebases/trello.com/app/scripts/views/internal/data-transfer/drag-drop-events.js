// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { countWhile } = require('app/scripts/lib/util/array/count-while');
const { trigger } = require('app/scripts/lib/util/event/trigger');
const { getTypes, getDropped } = require('./normalize');

/*
This doesn't export anything, but it will cause the following events to be
triggered:

dd-enter:files - One or more files was dragged over the element
dd-enter:text  - Some text was dragged over the element
dd-enter:url   - A URL was dragged over the element

dd-leave:files - One or more files dragged over the element had left
dd-leave:text  - Text that was dragged on the element left
dd-leave:url   - A URL dragged on the element has left

dd-drop:files  - One or more files was dropped on the element.  The array of
                 files is available in the event.detail
dd-drop:text   - Some text as dropped on the element.  The text is available in
                 the event.detail
dd-drop:url    - A URL was dropped on the element.  The URL is avilable in the
                 event detail

If the element handles the drop, it should use stopPropagation to prevent the
drop from being handled by enclosing elements.
*/

const onEvent = function (eventName, callback) {
  document.addEventListener(eventName, callback);
};

const triggerWithTypes = function (target, baseEventName, types, options) {
  for (const type of Array.from(types)) {
    trigger(target, `${baseEventName}:${type}`, options);
  }
};

// The element and all of its ancestors.  The top ancestor is first in the
// list, the original element is last
const elementAndParents = function (element) {
  if (element) {
    const parents = elementAndParents(element.parentElement);
    parents.push(element);
    return parents;
  } else {
    return [];
  }
};

let hoveredElements = [];
let leftWindowTimeout = null;

// We maintain a list of elements that the drag is currently over, so we can
// accurately tell when the dragging has entered or left an element
//
// The list contains the highest parent in the leftmost position and the
// closest target in the rightmost position
const updateHoveredElements = function (target, types) {
  let element;
  clearTimeout(leftWindowTimeout);

  // If the current target is the same as the closest target from the last
  // check, assume that nothing has changed
  if (
    hoveredElements.length > 0 &&
    hoveredElements[hoveredElements.length - 1] === target
  ) {
    return;
  }

  const newHovered = elementAndParents(target);
  // Find the first element in the new list that wasn't in the previous one;
  // that tells us how far up the change goes
  const inBothCount = countWhile(
    newHovered,
    hoveredElements,
    (newEl, hoveredEl) => newEl === hoveredEl,
  );

  for (element of Array.from(hoveredElements.slice(inBothCount))) {
    triggerWithTypes(element, 'dd-leave', types, { bubbles: false });
  }

  for (element of Array.from(newHovered.slice(inBothCount))) {
    triggerWithTypes(element, 'dd-enter', types, { bubbles: false });
  }

  return (hoveredElements = newHovered);
};

onEvent('dragenter', function (e) {
  updateHoveredElements(e.target, getTypes(e.dataTransfer));
  return e.preventDefault();
});

onEvent('dragover', function (e) {
  const types = getTypes(e.dataTransfer);
  if (types.length > 0) {
    // We have to set the dropEffect to actually get it to drop; it may come to
    // us as 'none', e.g. if someone is dragging from the downloads bar in
    // chrome
    e.dataTransfer.dropEffect = 'copy';
  }

  // It appears that dragenter isn't always fired, e.g. when an element is right
  // on the edge of the window, so we check here as well
  updateHoveredElements(e.target, types);
  return e.preventDefault();
});

onEvent('dragleave', function (e) {
  // So it's possible to leave the element without going over a new element,
  // e.g. if the element was right against the edge of the window.
  const types = getTypes(e.dataTransfer);
  return (leftWindowTimeout = setTimeout(
    () => updateHoveredElements(null, types),
    200,
  ));
});

onEvent('dragend', (e) => updateHoveredElements(null, []));

onEvent('drop', function (e) {
  const types = getTypes(e.dataTransfer);

  getDropped(e).then(function (dropped) {
    for (const type in dropped) {
      const detail = dropped[type];
      trigger(e.target, `dd-drop:${type}`, { detail });
    }

    return updateHoveredElements(null, types);
  });

  e.preventDefault();
});
