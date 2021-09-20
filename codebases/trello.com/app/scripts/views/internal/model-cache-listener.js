const { ModelCache } = require('app/scripts/db/model-cache');
const React = require('react');
const xtend = require('xtend');

module.exports = function (ComposedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(...arguments);
      this.listeners = [];
      this.modelListeners = [];
    }

    listenTo(events, callback) {
      ModelCache.on(events, callback);
      return this.listeners.push({
        events,
        callback,
      });
    }

    modelListener(model, events, callback) {
      model.on(events, callback);
      return this.modelListeners.push({
        model,
        events,
        callback,
      });
    }

    clearModelListeners() {
      return this.modelListeners.forEach(({ model, events, callback }) =>
        model.off(events, callback),
      );
    }

    componentWillUnmount() {
      this.listeners.forEach(({ events, callback }) =>
        ModelCache.off(events, callback),
      );
      return this.clearModelListeners();
    }

    render() {
      const newProps = xtend(this.props, {
        listenTo: this.listenTo.bind(this),
        modelListener: this.modelListener.bind(this),
        clearModelListeners: this.clearModelListeners.bind(this),
      });

      return <ComposedComponent {...newProps} />;
    }
  };
};
