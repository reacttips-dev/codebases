import useMessageFormatter from '@core/i18n/useMessageFormatter';
import i18nMessages from '@core/notifications/i18n';
import { NotificationSeverity } from '@core/notifications/types';

const useNotificationAriaLabel = (
  severity: NotificationSeverity,
  title?: string
): string | undefined => {
  const formatter = useMessageFormatter(i18nMessages);

  const a11yLabelStatus: Record<NonNullable<NotificationSeverity>, string> = {
    information: formatter('information', { title }),
    warning: formatter('warning', { title }),
    success: formatter('success', { title }),
    error: formatter('error', { title }),
  };
  return a11yLabelStatus[severity as NonNullable<NotificationSeverity>];
};

export default useNotificationAriaLabel;
