// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const _ = require('underscore');

module.exports.DisplayEntityMixin = {
  // This does preprocessing on the entities, specifically member entities, to
  // include any nonPublic data we may have available
  getDisplay() {
    const display = this.get('display');
    if (!display) {
      return null;
    }
    const entities = _.mapObject(_.clone(display.entities), (e) => {
      const entity = _.clone(e);
      if (entity.type === 'member') {
        const memberModel = this.modelCache.get('Member', entity.id);
        /* TRELP-3056
         * It's possible that the server provides us with a member in the
         * entities but no extra information about that member so the only
         * details we have are those in the entity. There are lots of code
         * that assumes that a member entity will be in the ModelCache and
         * does things like show a popover. The truth however is if we can't
         * find a member in the ModelCache this code used to fail and lot's
         * of other code fails too because of the assumption on data existence.
         * The fix for this is to not assume a member will exist in the cache,
         * furthermore if we can't find a member in the cache we should change
         * the type on this entity for rendering to be a text type so that the
         * UI will just output the value and not treat it in any special manner.
         */
        if (!memberModel) {
          entity.type = 'text';
        } else {
          entity.text = memberModel.get('fullName') || entity.text;
        }
      }

      return entity;
    });
    return _.extend(display, { entities });
  },
};
