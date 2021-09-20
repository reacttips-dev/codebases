import CurrentUserDetailsService from '../../js/services/CurrentUserDetailsService';

export default {
  /**
   * Returns an array of search scope
   * filters with their respective labels.
   *
   * @returns {Array} - Array of Scope filters objects {action: String, label: String}
   */
  getScopeFilters () {
    const filters = [{ action: 'all', label: 'All of Postman', placeholder: 'all of Postman' }],
          teamId = CurrentUserDetailsService.teamId,
          teamName = CurrentUserDetailsService.teamName;

    if (teamId && teamName) {
      filters.push({ action: 'team', label: `Team ${teamName}`, placeholder: `team ${teamName}` });
    } else {
      filters.push({ action: 'personal', label: 'Personal space', placeholder: 'personal space' });
    }

    filters.push({ action: 'public', label: 'Public API Network', placeholder: 'Public API Network' });

    return filters;
  }

};
