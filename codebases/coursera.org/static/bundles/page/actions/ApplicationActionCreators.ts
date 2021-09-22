const exported = {
  // TODO consider handling this case in an analog to `parseRequest` that takes `window`
  setUserAgent: (actionContext: any, payload: any) => {
    actionContext.dispatch('SET_USER_AGENT', payload);
  },
};

export default exported;

export const { setUserAgent } = exported;
