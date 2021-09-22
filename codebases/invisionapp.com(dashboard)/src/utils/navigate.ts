declare global {
  interface Window {
    inGlobalContext?: any;
  }
}

const navigate = (
  targetUrl: string,
  openInNewWindow?: boolean
): string | undefined => {
  if (!targetUrl || targetUrl.length === 0) {
    return;
  }

  if (window?.inGlobalContext?.appShell?.navigate) {
    openInNewWindow
      ? window.open(targetUrl)
      : window.inGlobalContext.appShell.navigate(targetUrl);
  } else {
    // Log for local testing purposes only
    console.log("Navigate to ->", targetUrl, openInNewWindow);
  }

  return targetUrl;
};

export default navigate;
