import React from 'react'

import NextLink from 'next/link'

import { PlanName } from 'tribe-api'
import { Link, LinkProps } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useUpgradeTouchpoint } from 'hooks/useUpgradeTouchpoint'

type UpgradeTouchpointLinkProps = LinkProps & {
  requiredPlan?: PlanName | null
}

export const UpgradeTouchpointLink: React.FC<UpgradeTouchpointLinkProps> = ({
  children,
  requiredPlan,
  ...props
}) => {
  const { upgradeLink, onUpgradeClick } = useUpgradeTouchpoint(requiredPlan)

  return (
    <NextLink href={upgradeLink} passHref>
      <Link color="accent.base" onClick={onUpgradeClick} {...props}>
        {children || (
          <Trans i18nKey="admin:billing.plan.upgrade" defaults="Upgrade" />
        )}
      </Link>
    </NextLink>
  )
}
