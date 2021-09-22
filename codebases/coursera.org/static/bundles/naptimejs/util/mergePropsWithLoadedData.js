import NaptimeClient from 'bundles/naptimejs/client/NaptimeClient';
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
import NaptimeProp from 'bundles/naptimejs/util/NaptimeProp';

export default function (NaptimeComponent, context, props) {
  const naptimeStore = context.getStore(NaptimeStore);
  const wrappedComponentProps = NaptimeComponent.getWrappedComponentProps(props);

  const mergedProps = {};
  const naptimeProp = { paging: {} };

  const allDataIsLoaded = Object.keys(wrappedComponentProps).every((propKey) => {
    const prop = wrappedComponentProps[propKey];
    if (prop instanceof NaptimeClient && prop.isValid()) {
      // is NaptimeClient
      const naptimeDataJson = naptimeStore.getOptimisticDataForClient(prop);
      let naptimeData = naptimeDataJson;
      const ResourceClass = prop.resource;

      if (Array.isArray(naptimeDataJson)) {
        naptimeData = naptimeDataJson.map((data) => new ResourceClass(data));
      } else if (typeof naptimeDataJson === 'object' && naptimeDataJson !== null) {
        naptimeData = new ResourceClass(naptimeDataJson);
      }

      if (naptimeData !== undefined) {
        mergedProps[propKey] = naptimeData;
        naptimeProp.paging[propKey] = naptimeStore.getPagingForClient(prop);
        return true;
      } else {
        return false;
      }
    } else {
      mergedProps[propKey] = prop;
      return true;
    }
  });

  const required = Object.keys(wrappedComponentProps).every((propKey) => {
    const prop = wrappedComponentProps[propKey];
    if (prop instanceof NaptimeClient) {
      return prop.isRequiredForRender();
    } else {
      return true;
    }
  });

  mergedProps.naptime = new NaptimeProp(naptimeProp);

  return {
    mergedProps,
    allDataIsLoaded,
    required,
  };
}
