const TOPHER_THUMBNAIL_SUFFIX = "_thumb_w32_h";
const TOPHER_URL_SUBSTRING = "/topher/";

export default {
  isTopherUrl: (url: string): boolean => {
    return url.indexOf(TOPHER_URL_SUBSTRING) > -1;
  },

  getTopherPlaceholder: (url: string): string => {
    const startExtension = url.lastIndexOf(".");
    if (startExtension > -1) {
      return (
        url.slice(0, startExtension) +
        TOPHER_THUMBNAIL_SUFFIX +
        url.slice(startExtension)
      );
    } else {
      return url;
    }
  }
};
