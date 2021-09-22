import $ from 'jquery';

const ExternalLinks = {
  /**
   * Same as `safelyOpenUrl`, but takes a link click event as an argument instead of a `url`.
   * */
  onClick(e: React.SyntheticEvent<HTMLLinkElement>) {
    e.preventDefault();
    // @ts-expect-error We know that this is link element and it has href attr
    ExternalLinks.safelyOpenUrl($(e.currentTarget).attr('href'));
  },

  /**
   * Opens `url` in a new tab, without giving the new tab access to its opener. Giving the new tab access to its
   * opener is a security risk. See https://coursera.atlassian.net/browse/ASSESS-1937.
   */
  safelyOpenUrl(url: string) {
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.opener = null;
      newWindow.location.href = url;
    }
  },
};

export default ExternalLinks;
