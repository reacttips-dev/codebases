import type { ValidationStatus } from '@core/forms/FormControl';
import i18nMessages from '@core/forms/i18n';
import useMessageFormatter from '@core/i18n/useMessageFormatter';

export default function useValidationAriaLabel(
  label?: string,
  validationStatus?: ValidationStatus
): string | undefined {
  const formatter = useMessageFormatter(i18nMessages);

  if (!label || !validationStatus) {
    return undefined;
  }

  const statusLabelMap: Record<NonNullable<ValidationStatus>, string> = {
    success: formatter('success', { label }),
    error: formatter('error', { label }),
  };

  return statusLabelMap[validationStatus];
}
