const PATHS = {
  '/dashboard': 'dashboard',
  '/dashboard/episodes': 'episode_list',
  '/dashboard/episodes/subscribe': 'pw_setup',
  '/dashboard/episode/:podcastEpisodeId': 'episode_details',
  '/dashboard/episode/:podcastEpisodeId/edit': 'episode_edit',
  '/dashboard/episode/:podcastEpisodeId/metadata/edit': 'episode_metadata_edit',
  '/dashboard/episode/new': 'episode_editor',
  '/dashboard/money': 'money',
  '/dashboard/podcast/edit': 'settings',
  '/login': 'log_in',
  '/signup': 'sign_up',
};

export default function getScreenFromRoute(pathname) {
  return PATHS[pathname];
}
