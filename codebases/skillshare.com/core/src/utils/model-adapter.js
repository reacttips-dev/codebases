import Video from 'core/src/models/video/video';

const modelAdapter = {
  sessionToVideo: function(session) {
    let platformVideoId = session.get('brightcove_id');
    if (!platformVideoId) {
      platformVideoId = (session.get('videoId') || '').replace('bc:', '');
    }

    const video = new Video({
      platform_video_id: platformVideoId,
      thumbnails: session.get('thumbnails'),
    });
    return video;
  },
};

export default modelAdapter;


