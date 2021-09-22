import _ from 'lodash';

// NOTE: FROZEN, DO NOT CHANGE WITHOUT CONTACTING FRONTEND-INFRA

/* eslint-disable react/sort-comp */
import PropTypes from 'prop-types';

import Q from 'q';
import React from 'react';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';
import NaptimeClient from 'bundles/naptimejs/client/NaptimeClient';
import loadDataForClients from 'bundles/naptimejs/util/loadDataForClients';
import executeMutation from 'bundles/naptimejs/util/executeMutation';
import mergePropsWithLoadedData from 'bundles/naptimejs/util/mergePropsWithLoadedData';
import calculateDataRequirements from 'bundles/naptimejs/util/calculateDataRequirements';
import compareDataRequirements from 'bundles/naptimejs/util/compareDataRequirements';
import initListeners from 'bundles/naptimejs/util/initListeners';
import removeListeners from 'bundles/naptimejs/util/removeListeners';
import refresh from 'bundles/naptimejs/util/refresh/refresh';
import 'vendor/cnpm/setimmediate.v1/setImmediate';

/**
 * Helper function that wraps a standard React component in a NaptimeJS higher-order component, responsible for data
 * fetching both from existing Fluxible stores, as well as from the server through the global Naptime store
 *
 * @param  {component} Component -  Base react component that is being wrapped in a NaptimeJS Container
 * @param  {function} getWrappedComponentProps - Function that takes in (context, props) and returns additional props
 *                                             to annotate the wrapped component with. This function will be called both
 *                                             before and after any remote data is loaded, and is also used to get
 *                                             context for determining which requests need to be made.
 * @return {component} Higher-order Component that handles loading data from stores and fetching data.
 */
function createContainer(Component, getWrappedComponentProps = () => ({})) {
  const componentName = Component.displayName || Component.name;

  // If the wrapped component has a NaptimeJS `getWrappedComponentProps` because it is a naptime component or
  // `naptimeConnectorComponent` because it is hoists another naptime component, make sure that component is a listed
  // subcomponent for data dependencies.
  let getComponentProps = getWrappedComponentProps;
  if (Component.getWrappedComponentProps || Component.naptimeConnectorComponent) {
    getComponentProps = (props) => {
      const clients = getWrappedComponentProps(props);
      Object.keys(clients).forEach((clientKey) => {
        const existingSubcomponents = clients[clientKey].subcomponents || [];
        const newSubcomponent = Component.naptimeConnectorComponent || Component;
        clients[clientKey].subcomponents = [...existingSubcomponents, newSubcomponent];
      });

      return clients;
    };
  }

  class NaptimeConnector extends React.Component {
    static displayName = componentName + 'NaptimeConnector';

    static contextTypes = {
      executeAction: PropTypes.func.isRequired,
      getStore: PropTypes.func.isRequired,
      onDataRequired: PropTypes.func,
    };

    static childContextTypes = {
      executeMutation: PropTypes.func,
    };

    static getWrappedComponentProps = getComponentProps;

    state = {
      allDataIsLoaded: false,
      pending: false,
      required: true,
    };

    /**
     * Determines any asyncronous data needs and calls the `onDataRequired` prop callback function,
     * if it is supplied as a prop. This is used to handle server-side rendering's data needs.
     */
    constructor(props, context) {
      super(props, context);

      const naptimeStore = context.getStore('NaptimeStore');
      const clientsWithoutData = calculateDataRequirements(this.constructor, context, props);

      if (clientsWithoutData.length) {
        const loadDataPromise = loadDataForClients(context, clientsWithoutData, naptimeStore.fulfilledUrls).then(
          (responseData) => {
            return naptimeStore.processData(this.requestId, responseData);
          }
        );

        loadDataPromise.done();
      }

      this.refreshData = (...args) => {
        return refresh(context.getStore('NaptimeStore'), context.getStore('ApplicationStore'), ...args).then(() => {
          this.fetchData();
        });
      };

      this.executeMutation = (client, options = {}) => executeMutation(client, this.naptimeStore, options);
    }

    /**
     * When a NaptimeJS component is mounted attempt to load data from the Naptime Store
     */
    componentDidMount() {
      this._isMounted = true;
      this.naptimeStore = this.context.getStore('NaptimeStore');

      initListeners(this, this.props, this.context);
      this.fetchData();
    }

    /**
     * When a component's props change, it _could_ result in a change to the query used to fetch data (i.e. a search
     * query) In this case, we attempt to refetch data. If there are no changes to the query, this becomes a noop
     */
    componentWillReceiveProps(nextProps) {
      const noDataChanges = compareDataRequirements(this.constructor, this.context, this.props, nextProps);

      if (!noDataChanges) {
        this.fetchData(nextProps);
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      // do not update until data finishes loading
      return nextState.required ? !nextState.pending : true;
    }

    /**
     * On a NaptimeJS component unmount, clean up all listeners to avoid pollution
     */
    componentWillUnmount() {
      // Remove all event listeners applied as part of initListeners in the constructor
      removeListeners(this, this.props, this.context);
      this._isMounted = false;
    }

    getChildContext() {
      return {
        executeMutation: this.executeMutation,
      };
    }

    /**
     * Set the state that will be passed to the child components from the naptime store.
     */
    getStateFromStores(props = this.props) {
      this.naptimeStore = this.context.getStore('NaptimeStore');

      const { mergedProps, allDataIsLoaded, required } = mergePropsWithLoadedData(
        this.constructor,
        this.context,
        props
      );

      // once allDataIsLoaded is set to true, never revert it to false.
      const dataHasBeenLoaded = allDataIsLoaded || this.state.allDataIsLoaded;

      return {
        mergedProps,
        allDataIsLoaded: dataHasBeenLoaded,
        required,
      };
    }

    /**
     * Invalidate resources or just entities of resources
     *
     * Get the data to be passed to the child component.
     * @param {object} props - props, usually this.props
     */
    fetchData = (props = this.props) => {
      const clientsWithoutData = calculateDataRequirements(this.constructor, this.context, props);

      /**
       * We check if we have all of the data that this component is requesting. If so, we can immediately render.
       * Otherwise, we need to request the data from the server, and then rerender (by updating state) once the
       * request completes
       */

      if (this._isMounted) {
        if (clientsWithoutData.length === 0) {
          const stateFromStores = this.getStateFromStores(props);
          const existingState = {
            mergedProps: this.state.mergedProps,
            allDataIsLoaded: this.state.allDataIsLoaded,
            required: this.state.required,
          };

          if (!_.isEqual(stateFromStores, existingState)) {
            this.setState(stateFromStores);
          }
        } else if (!this.state.pending) {
          this.setState({ pending: true });

          const requestListener = (requestId) => {
            if (this.requestId === requestId && this._isMounted) {
              this.setState(Object.assign({ pending: false }, this.getStateFromStores(props)));
            }

            this.naptimeStore.removeRequestListener(requestId, requestListener);
          };

          this.requestId = this.naptimeStore.addRequestListener(requestListener);
        }

        if (clientsWithoutData.length > 0) {
          loadDataForClients(this.context, clientsWithoutData)
            .then((responseData) => {
              return this.naptimeStore.processData(this.requestId, responseData);
            })
            .done();
        }
      }
    };

    /**
     * Renders the lower (wrapped) component, using the state in the higher-order component as props for the wrapped
     * component.
     */
    render() {
      const { mergedProps, allDataIsLoaded, required } = this.getStateFromStores(this.props);
      if (!allDataIsLoaded && required) {
        if (Component.LOADING_COMPONENT) {
          return React.createElement(Component.LOADING_COMPONENT);
        } else {
          return null;
        }
      }

      const passThroughProps = {};

      /*
       * We want to filter out Naptime Clients as props for the wrapped component.
       * These clients are used to tell this component what data to fetch, but we would rather something like:
       * `this.props.courses === undefined` rather than `!(this.props.courses instanceof NaptimeClient)`
       */
      const props = mergedProps;
      Object.keys(props || {})
        .filter((propKey) => !(props[propKey] instanceof NaptimeClient))
        .forEach((propKey) => {
          passThroughProps[propKey] = props[propKey];
        });

      // TODO(bryan): construct NaptimeProp in a centralized place with a reference to the HOC so we can remove this.
      passThroughProps.naptime.refreshData = this.refreshData;
      passThroughProps.naptime.executeMutation = this.executeMutation;

      return React.createElement(
        Component,
        Object.assign({ pending: this.state.pending }, this.props, passThroughProps)
      );
    }
  }
  hoistNonReactStatics(NaptimeConnector, Component);

  return NaptimeConnector;
}

/**
 * Support syntax that allows createContainer to be used like
 * (getWrappedComponentPropsFn) => (Component => ContainedComponent)
 * rather than (Component, getWrappedComponentPropsfn) => ContainedComponent
 */
export default function (...args) {
  if (args.length === 1) {
    const getWrappedComponentProps = args[0];
    return function (Component) {
      return createContainer(Component, getWrappedComponentProps);
    };
  }

  return createContainer.apply(this, args);
}
