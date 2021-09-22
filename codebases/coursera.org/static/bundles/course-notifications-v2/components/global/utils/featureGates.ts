import epic from 'bundles/epic/client';

export const isNextSessionNotificationV2Enabled = () =>
  epic.get('learnerRedPandas', 'nextSessionNotificationV2Enabled');
