import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import constants from 'pages/open-course/common/constants';

import {
  SubtitleAttr,
  Sources,
  SourcesByResolution,
  Poster,
  Posters,
  Subtitle,
  Subtitles,
  SubtitlesVtt,
  SubtitlesTxt,
} from 'bundles/video-player/types/VideoContent';

class VideoContent {
  $key: any;

  $value: any;

  videoId: string;

  sources: SourcesByResolution;

  posters: Posters;

  subtitles: Subtitles;

  subtitlesVtt: SubtitlesVtt;

  subtitlesTxt: SubtitlesTxt;

  itemMetadata: ItemMetadata;

  name: string;

  constructor({
    videoId,
    sources,
    posters,
    subtitles,
    subtitlesVtt,
    subtitlesTxt,
    itemMetadata,
  }: {
    videoId: string;
    sources: SourcesByResolution;
    posters: Posters;
    subtitles: Subtitles;
    subtitlesVtt: SubtitlesVtt;
    subtitlesTxt: SubtitlesTxt;
    itemMetadata: ItemMetadata;
  }) {
    this.videoId = videoId;
    this.sources = sources;
    this.posters = posters;
    this.subtitles = subtitles;
    this.subtitlesVtt = subtitlesVtt;
    this.subtitlesTxt = subtitlesTxt;
    this.itemMetadata = itemMetadata;
    this.name = itemMetadata.get('name');
  }

  getSources(): Sources {
    return this.getSourcesForResolution(constants.defaultNormalBandwidthVideoPlayerResolution);
  }

  getSourcesForResolution(resolution: string): Sources {
    return this.sources[resolution];
  }

  getPosterForResolution(resolution: string): Poster {
    return this.posters[resolution];
  }

  getCaptionForLanguage(languageCode: string): Subtitle {
    return this.subtitles[languageCode];
  }

  getSubtitlesUrl(subtitleAttr: SubtitleAttr, languageCode: string): string {
    const subtitleInfo = this[subtitleAttr][languageCode];
    return subtitleInfo && subtitleInfo.url;
  }

  getSubtitlesLabel(subtitleAttr: SubtitleAttr, languageCode: string): string {
    const subtitleInfo = this[subtitleAttr][languageCode];
    return subtitleInfo && subtitleInfo.label;
  }
}

export default VideoContent;
