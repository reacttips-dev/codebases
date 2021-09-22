/* Makes a backbone model "immutable" in the sense that it will log an error
 * and not do anything if you try to use .set on it after it is initialized. */

function makeImmutableModel(Model) {
  const originalInitialize = Model.prototype.initialize;
  return Model.extend({
    initialize() {
      if (originalInitialize) {
        originalInitialize.apply(this, arguments);
      }
      this.set = function () {
        console.error('set called on immutable model');
      };
    },
  });
}

export default makeImmutableModel;
