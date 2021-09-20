import _ from 'lodash';

import ItemDiff from './itemDiff';

/**
 * Since api will returns diff or conflict object in different format for each of different properties
 * this function will parse all of them and returns array of objects which are easily uniform in structure
 * and easily renderable in ui
 *
 * @param {String} itemType - type of item, for ex: collection, request, folder
 * @param {String} diffType - indicates how diff is generated for ex. modified, created, deleted
 * @param {Object} diff - diff object returned by api for events
 * @param {Boolean} conflict - boolean indicating whether there is conflict or not
 * @returns {Array<ItemScriptDiff|ItemArrayDiff|ItemSentenceDiff|ItemSentenceDiff>}
 */
export default function pmDiff (itemType, diffType, diff, conflict) {
  const diffArray = Object.keys(diff).map((property) => {
    // filtering out properties with empty values so
    // it does not show up in ui as empty state
    if (_.isEmpty(_.get(diff, [property]))) {
      return null;
    }

    return {
      property: property,
      [conflict ? 'conflict' : 'diff']: _.pick(diff[property], ['to', 'from']),
      originalId: diff[property].originalId
    };
  });

  return (new ItemDiff(itemType, diffType, diffArray)).getPropertyWiseDiff();
}
