export function addProtocol(url = '') {
  if (!url) return url;
  if (url.match(/^https?:\/\//)) {
    return url;
  }
  return `https://${url}`;
}

export const typeByPlatform = platform => {
  switch (platform) {
    case 'facebook':
      return 'FacebookLogoSimple';
    case 'twitter':
      return 'TwitterLogo';
    case 'youtube':
      return 'Youtube';
    case 'instagram':
      return 'Instagram';
    default:
      return 'link';
  }
};
export const sortSocialLinks = (a, b) => {
  switch (a) {
    case 'facebook':
      return -1;
    case 'instagram':
      return b === 'facebook' ? 1 : -1;
    case 'twitter':
      return b === 'youtube' ? -1 : 1;
    default:
      return 0;
  }
};
