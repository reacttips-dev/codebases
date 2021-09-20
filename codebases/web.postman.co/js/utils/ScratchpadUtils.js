 /**
   * The function returns true if the scratchpad window is loaded as webview in the
   * requester.html
   */
  function isEmbeddedScratchpad () {
    let currentURL = new URL(location.href),
      isEmbedded = currentURL.searchParams.get('isEmbedded');

    return Boolean(pm.isScratchpad && isEmbedded);
}

export {
  isEmbeddedScratchpad
};
