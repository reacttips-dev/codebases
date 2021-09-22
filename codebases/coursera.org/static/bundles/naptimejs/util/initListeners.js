import { Finder, GetAll } from 'bundles/naptimejs/client/index';
import NaptimeClient from 'bundles/naptimejs/client/NaptimeClient';
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';

/**
 * Calculates which NaptimeClients on a NaptimeComponent don't have the data they need to render
 * @param  {component} NaptimeComponent higher-order NaptimeJS component
 * @param  {object} props               props passed in to higher-order NaptimeJS component
 * @param  {context} context            Fluxible context that includes NaptimeStore
 * @return {array}                      NaptimeClients that don't have data loaded yet
 */
export default function initListeners(component, props, context) {
  const naptimeStore = context.getStore(NaptimeStore);
  const NaptimeComponent = component.constructor;
  const wrappedComponentProps = NaptimeComponent.getWrappedComponentProps(props);

  const naptimeClientKeys = Object.keys(wrappedComponentProps).filter((propKey) => {
    const client = wrappedComponentProps[propKey];
    return client instanceof NaptimeClient && client.isValid();
  });

  naptimeClientKeys.forEach((clientKey) => {
    const client = wrappedComponentProps[clientKey];

    if (client.id) {
      naptimeStore.listenToElement(component.fetchData, client.resourceName, client.id);
    }

    if (client.ids) {
      client.ids.forEach((id) => {
        naptimeStore.listenToElement(component.fetchData, client.resourceName, client.id);
      });
    }

    if (client instanceof Finder || client instanceof GetAll) {
      naptimeStore.listenToResource(component.fetchData, client.resourceName);
    }
  });
}
