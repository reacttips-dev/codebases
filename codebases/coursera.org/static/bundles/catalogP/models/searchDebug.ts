import _ from 'underscore';
import Backbone from 'backbone-associations';

const SearchDebug = Backbone.AssociatedModel.extend({
  parse(data: $TSFixMe) {
    data = _.reduce(
      data.explain,
      function (memo, explain, id) {
        const boosts = _(data.boosts[id]).omit('score');
        const boostMultiplier = _(boosts).reduce((memo, value) => memo * value, 1);
        const rawScore = explain.value / boostMultiplier;
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        memo[id] = _({ boostMultiplier, rawScore }).extend(explain, { boosts });

        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const boostDebug = _(memo[id].details).last();
        // Inject boost debug info manually
        if (boostDebug) {
          boostDebug.details = [
            {
              description: 'product of',
              value: boostMultiplier,
              details: _(boosts).map(function (value, key) {
                return { value, description: key };
              }),
            },
          ];
        }

        return memo;
      },
      {}
    );
    return data;
  },

  merge(searchDebug: $TSFixMe) {
    this.set(searchDebug.attributes);
  },
});

export default SearchDebug;
