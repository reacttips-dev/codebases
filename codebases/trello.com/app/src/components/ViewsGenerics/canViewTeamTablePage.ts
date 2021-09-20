/**
 * Indicates whether a team can be exposed to the team table feature in navigational components
 * This function does not indicate access to the team table feature itself, which shows upsells
 * for teams without 'views'
 *
 * @param hasViewsFeature indicates whether the team has the views feature via a check like org.isFeatureEnabled(PremiumFeature.Views),
 * @param isPremiumTeam indicates whether the team is "premium". Premium is defined a few different ways throughout the code right now.
 *        Typically, this means the team is either business class or enterprise. Standard sku teams are not considered "premium" in this
 *        instance because while we want to show the team table in navigation to standard sku teams as a carrot to upgrade, we do not
 *        currently want the same for legacy business class teams.
 * @returns
 */
export function canViewTeamTablePage(
  hasViewsFeature: boolean | undefined,
  isPremiumTeam: boolean | undefined,
): boolean {
  // Notably legacy business class teams will not see the team table navigational components
  if (hasViewsFeature || !isPremiumTeam) {
    return true;
  } else {
    return false;
  }
}
