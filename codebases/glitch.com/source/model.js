/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

// A composable data model that serializes cleanly to JSON and provides
// observable properties.

const Observable = require('o_0');

// eslint-disable-next-line no-return-assign
const defAccessor = (self, attrName) =>
    // eslint-disable-next-line func-names
    (self[attrName] = function(newValue) {
        if (arguments.length > 0) {
            self.I[attrName] = newValue;

            return self;
            // eslint-disable-next-line no-else-return
        } else {
            return self.I[attrName];
        }
    });
module.exports = (I = {}, self = {}) => {
    I = I || /* istanbul ignore next */ {};
    self = self || /* istanbul ignore next */ {};
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return extend(self, {
        I,

        // Generates a public jQuery style getter / setter method for each String
        // argument
        attrAccessor(...attrNames) {
            attrNames.forEach((attrName) => defAccessor(self, attrName));

            return self;
        },

        // Generates a public jQuery style getter method for each String argument
        /* istanbul ignore next */
        attrReader(...attrNames) {
            // eslint-disable-next-line no-return-assign
            attrNames.forEach((attrName) => (self[attrName] = () => I[attrName]));

            return self;
        },

        // Extends an object with methods from the passed in object
        // >     I =
        // >       x: 30
        // >       y: 40
        // >       maxSpeed: 5
        // >     player = Model(I).extend
        // >       increaseSpeed: ->
        // >         I.maxSpeed += 1
        // >     player.increaseSpeed()
        extend(...objects) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return extend(self, ...Array.from(objects));
        },

        // Includes a module in this object.
        // A module is a constructor that takes two parameters, I and self
        // >     myObject = Model()
        // >     myObject.include(Bindable)
        // >     myObject.bind "someEvent", ->
        // >       alert("wow. that was easy.")
        include(...modules) {
            // eslint-disable-next-line prefer-const
            for (let Module of modules) {
                Module(I, self);
            }

            return self;
        },

        // Specify any number of attributes as observables which listen to changes
        // when the value is set
        attrObservable(...names) {
            // eslint-disable-next-line func-names
            names.forEach(function(name) {
                self[name] = Observable(I[name]);
                // eslint-disable-next-line no-return-assign
                return self[name].observe((newValue) => (I[name] = newValue));
            });

            return self;
        },

        // Model an attribute as an object
        // >     self.attrDatum("position", Point)
        attrDatum(name, DataModel) {
            let model;
            // eslint-disable-next-line no-multi-assign
            I[name] = model = DataModel(I[name]);
            self[name] = Observable(model);
            // eslint-disable-next-line no-return-assign
            self[name].observe((newValue) => (I[name] = newValue));

            return self;
        },

        // Models an array attribute as an observable array of data objects
        attrData(name, DataModel) {
            /* istanbul ignore next */
            const models = (I[name] || []).map((x) => DataModel(x));
            self[name] = Observable(models);
            // eslint-disable-next-line no-return-assign
            self[name].observe((newValue) => (I[name] = newValue.map((x) => DataModel(x))));

            return self;
        },

        // Specify an attribute to treat as an observerable model instance
        attrModel(name, Model) {
            const model = Model(I[name]);
            self[name] = Observable(model);
            // eslint-disable-next-line no-return-assign
            self[name].observe((newValue) => (I[name] = newValue.I));

            return self;
        },

        // Observe a list of attribute models.
        // This is the same as attrModel except the attribute is expected to be an
        // array of models
        attrModels(name, Model) {
            /* istanbul ignore next */
            const models = (I[name] || []).map((x) => Model(x));
            self[name] = Observable(models);
            // eslint-disable-next-line no-return-assign
            self[name].observe((newValue) => (I[name] = newValue.map((instance) => instance.I)));

            return self;
        },

        // The JSON representation, I, is kept up to date via the observable properites
        toJSON() {
            return I;
        },
    });
};

// Extend an object with the properties of other objects
// eslint-disable-next-line vars-on-top, no-var, func-names
var extend = function(target, ...sources) {
    // eslint-disable-next-line prefer-const
    for (let source of sources) {
        // eslint-disable-next-line guard-for-in, prefer-const
        for (let name in source) {
            target[name] = source[name];
        }
    }
    return target;
};