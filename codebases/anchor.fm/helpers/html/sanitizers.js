const { sanitizeObjectKeys } = require('./sanitizeObjectKeys');

function sanitizePodcastMetadata(podcastMetadata) {
  const strippedKeys = ['podcastName', 'podcastAuthorName'];
  const sanitizedKeys = [
    'podcastDescription',
    'profileHeaderColor',
    'podcastImage',
    'podcastImage400',
  ];
  return sanitizeObjectKeys(podcastMetadata, { sanitizedKeys, strippedKeys });
}

function sanitizeEpisode(episode) {
  const sanitizedKeys = ['description'];
  const strippedKeys = ['title', 'episodeImage'];
  return sanitizeObjectKeys(episode, { sanitizedKeys, strippedKeys });
}

function sanitizeEpisodeAudio(episodeAudio) {
  const strippedKeys = ['caption'];
  return sanitizeObjectKeys(episodeAudio, { strippedKeys });
}
module.exports = {
  sanitizers: {
    episode: sanitizeEpisode,
    episodeAudio: sanitizeEpisodeAudio,
    podcastMetadata: sanitizePodcastMetadata,
  },
};
