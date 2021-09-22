import epic from 'bundles/epic/client';

/* eslint-disable-next-line import/prefer-default-export */
export const isCalendarSyncEnabled = () => {
  return epic.get('Flex', 'calendarSyncEnabled');
};
