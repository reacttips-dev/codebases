import NaptimeClient from 'bundles/naptimejs/client/NaptimeClient';

/**
 * Calculates which NaptimeClients on a NaptimeComponent don't have the data they need to render
 * @param  {component} NaptimeComponent higher-order NaptimeJS component
 * @param  {store} naptimeStore          NaptimeJS store
 * @param  {object} props                props passed in to higher-order NaptimeJS component
 * @return {array}                       NaptimeClients that don't have data loaded yet
 */
export default function calculateDataRequirements(NaptimeComponent, context, props) {
  const naptimeStore = context.getStore('NaptimeStore');
  const wrappedComponentProps = NaptimeComponent.getWrappedComponentProps(props);

  const naptimeClientKeys = Object.keys(wrappedComponentProps).filter((propKey) => {
    const client = wrappedComponentProps[propKey];
    return client instanceof NaptimeClient && client.isValid();
  });

  const clientsKeysWithoutData = naptimeClientKeys.filter((clientKey) => {
    const client = wrappedComponentProps[clientKey];
    return !naptimeStore.clientDataIsLoaded(client);
  });

  return clientsKeysWithoutData.map((clientKey) => wrappedComponentProps[clientKey]);
}
