import { useEffect } from 'react';
import { featureFlagClient } from '@trello/feature-flag-client';
import Alert from 'app/scripts/views/lib/alerts';
import { forNamespace } from '@trello/i18n';
const format = forNamespace('somethings wrong');

const onDisconnectActiveClients = (blockPollingRequests: boolean) => {
  if (blockPollingRequests) {
    Alert.showLiteralText(
      format('disconnected-from-trello'),
      'warning',
      'alert',
    );
  }
};

export const useDisconnectAlert = () => {
  useEffect(() => {
    featureFlagClient.on(
      'fep.disconnect_active_clients',
      false,
      onDisconnectActiveClients,
    );
    return () => {
      featureFlagClient.off(
        'fep.disconnect_active_clients',
        onDisconnectActiveClients,
      );
    };
  }, []);
};
