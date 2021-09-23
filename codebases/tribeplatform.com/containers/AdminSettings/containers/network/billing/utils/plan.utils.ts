import { Network, PlanName, PlanRenewalType, Price } from 'tribe-api'

const PLAN_ORDER = [
  PlanName.BASIC,
  PlanName.PLUS,
  PlanName.PREMIUM,
  PlanName.ENTERPRISE,
]

export const getSeatsCapacity = (
  networkSeatsCapacity: number,
  planName: PlanName,
): number => {
  return Math.max(getCapacity(planName), networkSeatsCapacity, 1)
}

export const calculateDowngradePlan = (
  currentPlan: PlanName,
): PlanName | null => {
  switch (currentPlan) {
    case PlanName.ENTERPRISE:
      return PlanName.PREMIUM
    case PlanName.PREMIUM:
      return PlanName.PLUS
    case PlanName.PLUS:
      return PlanName.BASIC
    default:
      return null
  }
}

export const calculateUpgradePlan = (
  currentPlan: PlanName,
): PlanName | null => {
  switch (currentPlan) {
    case PlanName.BASIC:
      return PlanName.PLUS
    case PlanName.PLUS:
      return PlanName.PREMIUM
    case PlanName.PREMIUM:
      return PlanName.ENTERPRISE
    case PlanName.ENTERPRISE:
      return null
    default:
      return null
  }
}

export const getDisplayPrice = (
  planName: PlanName,
  renewalType: PlanRenewalType,
): string | Price => {
  switch (planName) {
    case PlanName.ENTERPRISE:
      return 'Contact Us'
    case PlanName.PREMIUM:
      if (renewalType === PlanRenewalType.MONTH) {
        return {
          __typename: 'Price',
          currency: 'USD',
          formattedValue: '$239',
          value: 239,
        }
      }

      return {
        __typename: 'Price',
        currency: 'USD',
        formattedValue: '$199',
        value: 199,
      }

    case PlanName.PLUS:
      if (renewalType === PlanRenewalType.MONTH) {
        return {
          __typename: 'Price',
          currency: 'USD',
          formattedValue: '$59',
          value: 59,
        }
      }

      return {
        __typename: 'Price',
        currency: 'USD',
        formattedValue: '$49',
        value: 49,
      }
    case PlanName.BASIC:
      return '$0'
    default:
      return ''
  }
}

export const getDisplayPriceDetails = (
  planName: PlanName,
  renewalType: PlanRenewalType,
): string => {
  switch (planName) {
    case PlanName.ENTERPRISE:
      return '10 staff seats, chat with us for additional'
    case PlanName.PREMIUM:
      return `5 staff seats, additional at $${
        renewalType === PlanRenewalType.YEAR ? '29' : '34'
      }/mo`
    case PlanName.PLUS:
      return `3 staff seats, additional at $${
        renewalType === PlanRenewalType.YEAR ? '19' : '22'
      }/mo`
    case PlanName.BASIC:
      return '1 staff seat'
    default:
      return ''
  }
}

export const getCapacity = (planName?: PlanName): number => {
  switch (planName) {
    case PlanName.ENTERPRISE:
      return 10
    case PlanName.PREMIUM:
      return 5
    case PlanName.PLUS:
      return 3
    case PlanName.BASIC:
      return 1
    default:
      return 1
  }
}

export const getDescription = (planName: PlanName) => {
  switch (planName) {
    case PlanName.ENTERPRISE:
      return 'For large businesses or those in regulated industries.'
    case PlanName.PREMIUM:
      return 'Administration apps and tools for brands and companies.'
    case PlanName.PLUS:
      return 'Essential apps and tools for small businesses and startups.'
    case PlanName.BASIC:
      return 'Free apps for individuals and small communities.'
    default:
      return ''
  }
}

export const getEmoji = (planName: PlanName) => {
  switch (planName) {
    case PlanName.ENTERPRISE:
      return 'rocket'
    case PlanName.PREMIUM:
      return 'airplane'
    case PlanName.PLUS:
      return 'bike'
    case PlanName.BASIC:
      return 'scooter'
    default:
      return ''
  }
}

export const getFeatures = (planName?: PlanName | null): string[] => {
  switch (planName) {
    case PlanName.ENTERPRISE:
      return [
        'Over 100,000 members',
        'Enterprise-grade security',
        'Data residency',
        'Uptime SLA',
        'Migration assistance',
      ]
    case PlanName.PREMIUM:
      return [
        '100,000 members',
        'Premium apps',
        'Single Sign-On (SSO)',
        'White-label',
        'Customer success manager',
      ]
    case PlanName.PLUS:
      return [
        '10,000 members',
        'Plus apps',
        'Analytics',
        'API access',
        'Email and chat support',
      ]
    case PlanName.BASIC:
      return [
        '100 members',
        'Unlimited spaces',
        'Basic apps',
        'Custom domain',
        'Theme customization',
        'Community support',
      ]
    default:
      return []
  }
}

export const availableInNetworkPlan = (
  network: Network,
  plan?: PlanName,
): boolean => {
  if (!plan) {
    return false
  }

  const networkPlan: PlanName =
    network?.subscriptionPlan?.name || PlanName.BASIC

  return PLAN_ORDER.indexOf(networkPlan) >= PLAN_ORDER.indexOf(plan)
}
