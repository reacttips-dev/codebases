import epic from 'bundles/epic/client';

export const areCourseHomeTweaksEnabled = (): boolean => epic.get('Flex', 'courseHomeTweaksEnabled');

//Epic Link - https://tools.coursera.org/epic/experiment/H7lL0AtxEeyo04tuGZ5lUA
export const areCourseCompletedHomeVariantEnabled = (): boolean =>
  epic.get('learnerRedPandas', 'courseCompletedHomeVariantEnabled');
