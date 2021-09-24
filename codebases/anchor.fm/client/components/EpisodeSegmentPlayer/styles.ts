import styled from '@emotion/styled';

const TruncatedEpisodeTitle = styled.h2`
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const TruncatedPodcastName = styled.h3`
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

export { TruncatedEpisodeTitle, TruncatedPodcastName };
