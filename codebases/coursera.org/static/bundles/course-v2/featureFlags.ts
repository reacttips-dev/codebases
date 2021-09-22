import epic from 'bundles/epic/client';

export const isCDSAdoptionQ2ABTestEnabled = () => {
  return epic.get('CDS-Learner', 'CDSQ2enabled');
  // https://tools.coursera.org/epic/experiment/vPgzkKa7EeuOTjX_usH0-Q
};

export const isCdsTeamworkPageEnabled = () => {
  return epic.get('CDS-Learner', 'TeamworkPage');
};

// learner/events is actually group-events app OfficeHoursPage.jsx
export const isCdsGroupEventsPageEnabled = () => {
  return epic.get('CDS-Learner', 'GroupEventsPage');
};

export const isHelpIconEnabled = () => {
  return epic.get('learnerRedPandas', 'lowerRightHelpWidgetEnabled');
};

export const isCdsGradesPageEnabled = () => {
  return epic.get('CDS-Learner', 'GradesPage');
};

export const isCdsCourseHomePageEnabled = () => {
  return epic.get('CDS-Learner', 'CourseHomePage');
};

export const isCdsCourseReferencePageEnabled = () => {
  return epic.get('CDS-Learner', 'CourseReferencePage');
};

export const isCdsLeftNavEnabled = () => {
  return epic.get('CDS-Learner', 'CDSLeftNav');
};

export const isCdsToCmlEnabled = () => {
  return epic.get('CDS-Learner', 'CDSToCML');
};

export const isCdsCourseInboxPageEnabled = () => {
  return epic.get('CDS-Learner', 'CourseInboxPage');
};

export const isCdsGroupClassmatesPageEnabled = () => {
  return epic.get('CDS-Learner', 'GroupClassmatesPage');
};

export const getDiscussionsPersonalizationVariant = () => {
  return epic.get('learnerRedPandas', 'discussionsPersonalizationVariant') || 'control';
};

export const isCdsPluginPageEnabled = () => {
  return (
    isCDSAdoptionQ2ABTestEnabled() &&
    // https://tools.coursera.org/epic/experiment/kRMrsLBaEeuf-ff4AADX-g
    epic.get('CDS-Learner', 'PluginPage')
  );
};

export const isCdsLtiPageEnabled = () => {
  return (
    isCDSAdoptionQ2ABTestEnabled() &&
    // https://tools.coursera.org/epic/experiment/AdlB4LBbEeua3M9xhD431g
    epic.get('CDS-Learner', 'LtiPage')
  );
};

export const isCdsUngradedLabPageEnabled = () => {
  return (
    isCDSAdoptionQ2ABTestEnabled() &&
    // https://tools.coursera.org/epic/experiment/HNDxoLBbEeuf-ff4AADX-g
    epic.get('CDS-Learner', 'UngradedLabPage')
  );
};

// Also used for the learner FramedLab environment, which applies to both programming assignments with labs, and ungraded labs
export const isCdsProgrammingAssignmentPageEnabled = () => {
  return (
    isCDSAdoptionQ2ABTestEnabled() &&
    // https://tools.coursera.org/epic/experiment/Ld4GkLBbEeuiYI13fSARaA
    epic.get('CDS-Learner', 'ProgrammingAssignmentPage')
  );
};

export const isCdsItemLecturePageEnabled = () => {
  return (
    isCDSAdoptionQ2ABTestEnabled() &&
    // https://tools.coursera.org/epic/experiment/Ld4GkLBbEeuiYI13fSARaA
    epic.get('CDS-Learner', 'CDSItemLectureEnabled')
  );
};

export const isFullstoryOnCourseHomeForPartnersEnabled = () => {
  return epic.get('FullStory', 'enableFullstoryOnCourseHomeForPartners');
};
