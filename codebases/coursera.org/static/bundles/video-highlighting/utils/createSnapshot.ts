import type { VideoPlayer } from 'bundles/item-lecture/types';

export default (videoPlayer: VideoPlayer): string => {
  const canvas = document.createElement('canvas');

  canvas.width = 960;
  canvas.height = 540;

  const mediaElement = videoPlayer.el().querySelector('video');
  const context = canvas.getContext('2d');

  if (context && mediaElement) {
    context.drawImage(mediaElement, 0, 0, canvas.width, canvas.height);
  }

  return canvas.toDataURL('image/jpeg');
};
