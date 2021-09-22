import { Finder, GetAll } from 'bundles/naptimejs/client/index';
import NaptimeClient from 'bundles/naptimejs/client/NaptimeClient';
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';

export default function removeListeners(component, props, context) {
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
      naptimeStore.removeElementListener(client.resourceName, client.id);
    }

    if (client.ids) {
      client.ids.forEach((id) => {
        naptimeStore.removeElementListener(client.resourceName, client.id);
      });
    }

    if (client instanceof Finder || client instanceof GetAll) {
      naptimeStore.removeResourceListener(component.fetchData, client.resourceName);
    }
  });
}
