import {
  NotificationChannel,
  SpaceNotificationPreference,
  PlanName,
  PlanRenewalType,
} from 'tribe-api/interfaces'
import { i18n } from 'tribe-translation'

export const enumI18nSpaceNotificationPreference = (
  value?: SpaceNotificationPreference | null,
): string => {
  switch (value) {
    case SpaceNotificationPreference.ALL:
      return i18n.t(
        'enums:SpaceNotificationPreference.ALL',
        'All activity (new posts & replies)',
      )
    case SpaceNotificationPreference.NEW_POST:
      return i18n.t('enums:SpaceNotificationPreference.NEW_POST', 'New posts')
    case SpaceNotificationPreference.NONE:
      return i18n.t('enums:SpaceNotificationPreference.NONE', 'Mute')
    default:
      return ''
  }
}

export const enumI18nNotificationChannel = (
  value: NotificationChannel,
): string => {
  switch (value) {
    case NotificationChannel.EMAIL:
      return i18n.t('enums:NotificationChannel.EMAIL', 'Email')
    case NotificationChannel.IN_APP:
      return i18n.t('enums:NotificationChannel.IN_APP', 'In-App')
    default:
      return ''
  }
}
export const enumI18nPlanName = (value?: PlanName | null): string => {
  switch (value) {
    case PlanName.BASIC:
      return i18n.t('enums:PlanName.BASIC', 'Basic')
    case PlanName.PLUS:
      return i18n.t('enums:PlanName.PREMIUM_PLUS', 'Plus')
    case PlanName.PREMIUM:
      return i18n.t('enums:PlanName.PREMIUM', 'Premium')
    case PlanName.ENTERPRISE:
      return i18n.t('enums:PlanName.ENTERPRISE', 'Enterprise')
    default:
      return ''
  }
}

export const enumI18nPlanRenewalType = (value: PlanRenewalType): string => {
  switch (value) {
    case PlanRenewalType.MONTH:
      return i18n.t('enums:PlanRenewalType.MONTHLY', 'Monthly')
    case PlanRenewalType.YEAR:
      return i18n.t('enums:PlanRenewalType.YEARLY', 'Yearly')
    default:
      return ''
  }
}
