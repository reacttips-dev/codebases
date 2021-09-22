import _t from 'i18n!nls/page-header';

export const getFreeItem = () => ({
  id: 'free',
  menuName: _t('Take a free course'),
  link: '/courses?query=free',
});

export const getDegreeItem = () => ({
  id: 'degrees',
  menuName: _t('Earn a Degree'),
  slug: 'degrees',
});

export const getCertificateItem = () => ({
  id: 'certificates',
  menuName: _t('Earn a Certificate'),
  slug: 'certificates',
});

export const getCareerLearningPathsItem = () => ({
  id: 'learning_paths',
  menuName: _t('Launch or advance your career'),
  slug: 'learning_paths',
});

export const getRootItem = () => ({
  id: 'rootDomain',
  menuName: 'root',
});

// the item above are used for Megamenu Redesign
// the domain below are used for the legacy Megamenu

export const getDegreeDomain = () => ({
  name: _t('Degrees'),
  id: 'degrees',
  slug: 'degrees',
});

export const getCertificateDomain = () => ({
  name: _t('Certificates'),
  id: 'certificates',
  slug: 'certificates',
});

export const getRootDomain = () => ({
  id: 'rootDomain',
  name: 'root',
  subdomains: { elements: [] },
});
