export const spaces = {
  PILOT: {
    SPACE_ID: 'gwyaud6pg98q',
    DELIVERY_ACCESS_TOKEN: 'ad708450802bef259f47619e93630d2ae35ea68d93271cadfaeb4af5473ff4ed',
    PREVIEW_ACCESS_TOKEN: 'fc50706390666d97bcdbfa31a14eca76a8fec86970232cfdbb4418cb731b012a',
  },
  CONTENT: {
    SPACE_ID: 'wp1lcwdav1p1',
    DELIVERY_ACCESS_TOKEN: '50d6818b7e5fa21880fa56d502309520c5c2287007c3aac773783c9581c99bdc',
    PREVIEW_ACCESS_TOKEN: '00330f0f3bf5496e88ff658258316532e60af32db9b60f3063f5f2a6c1129ba7',
  },
} as const;

const APP_SPACE = {
  'degree-home': spaces.CONTENT,
  'university-program': spaces.CONTENT,
  'premium-hub': spaces.CONTENT,
  'content-curation': spaces.CONTENT,
  'student-upswell': spaces.CONTENT,
  'career-plans': spaces.CONTENT,
  browse: spaces.CONTENT,
  search: spaces.CONTENT,
  about: spaces.CONTENT,
  academy: spaces.PILOT,
  xddp: spaces.CONTENT,
  launch: spaces.CONTENT,
  seo: spaces.CONTENT,
  'coursers-plus': spaces.CONTENT
};

const getSpaceConfigForApp = (slug: keyof typeof APP_SPACE) => APP_SPACE[slug];

export default getSpaceConfigForApp;
