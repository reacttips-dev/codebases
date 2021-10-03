import { fabric } from "fabric";

export const Video = fabric.util.createClass(fabric.Image, {
  type: "video",
  superType: "image",
  hasRotatingPoint: false,
  objectCaching: false,
  playbackRange: `#t=0`, // init playBackRange
  initialize(source, options) {
    options = options || {};
    const { onLoaded } = options;
    this.set({
      dirty: true,
      filters: options.filters || [],
    });
    this.createVideoElement(source, options);
    this.setSource(source);
    this.callSuper("initialize", this.getElement(), options);
    this.getElement().load();
    this.getElement().pause();
    if (onLoaded) {
      onLoaded(this);
    }
  },
  setSource(source) {
    if (source instanceof File) {
      this.setFile(source);
    } else {
      this.setSrc(source);
    }
    this.getElement().load();
    this.getElement().pause();
  },
  setFile(file) {
    this.set({
      file,
      src: null,
      video_src: null,
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.getElement().src = reader.result;
    };
    reader.readAsDataURL(file);
  },
  setSrc(src) {
    this.set({
      file: null,
      src,
      video_src: src,
    });
    this.getElement().src = this.playbackRange
      ? `${src}${this.playbackRange}`
      : src;
  },
  setCover(coverURL) {
    this.set({
      cover: coverURL,
    });
    this.getElement().poster = coverURL;
  },
  createPlaybackRange(startTime, endTime) {
    // To play trimmed video, default it starts to play with 0 second.
    if (startTime) {
      this.playbackRange = `#t=${startTime}`;
    }

    if (endTime) {
      this.playbackRange = `${this.playbackRange},${endTime}`;
    }
  },
  setVideoPlaybackRange(startTime, endTime) {
    // Before setting always create playback range
    this.createPlaybackRange(startTime, endTime);

    // Set value to video object
    this.set({
      startTime,
      endTime,
    });

    // It need to update video element
    // Set playbackrange to video's source element
    this.createVideoElement(this.src, this);
  },
  createVideoElement(videoURL, options) {
    // startTime, endTime must be in seconds
    let { id, cover, width, height, startTime, endTime } = options;
    let firstFrameURL = `${videoURL}#t=${startTime || 1}`;
    this.createPlaybackRange(startTime, endTime);

    let videoElement = fabric.util.makeElement("video", {
      id,
      preload: "auto",
      crossOrigin: "anonymous",
      muted: true,
      width,
      height,
      poster: firstFrameURL,
      src: `${videoURL}${this.playbackRange}`,
      type: "video/mp4",
      hidden: true,
    });

    let videoSource = fabric.util.makeElement("source", {
      id: `${id}_source`,
      crossOrigin: "anonymous",
      src: `${videoURL}${this.playbackRange}`,
      type: "video/mp4", // TODO: make video type dynamic
    });

    this.element = fabric.util.wrapElement(videoSource, videoElement, {});

    this.setElement(this.element);

    this.loadVideoElementInDOM(this.getElement());
  },
  loadVideoElementInDOM(videoElement) {
    let videoElementInDOM = fabric.document.getElementById(
      `${videoElement.id}`
    );
    if (!videoElementInDOM) {
      fabric.document.querySelector("body").appendChild(videoElement);
    } else {
      fabric.document
        .querySelector("body")
        .replaceChild(videoElement, videoElementInDOM);
    }
  },
  removeVideoElementFromDOM(videoElement) {
    let videoElementInDOM = fabric.document.getElementById(
      `${videoElement.id}`
    );
    if (!videoElementInDOM) {
      return;
    }
    videoElementInDOM.parentNode.removeChild(videoElementInDOM);
  },
  stop() {
    this.getElement().pause();
    this.getElement().currentTime = this.startTime || 0;
  },
  _render(ctx) {
    this.callSuper("_render", ctx);
    return;
  },
});

Video.fromObject = (options, callback) => {
  return callback(new Video(options.src || options.file, options));
};

window.fabric.Video = Video;

export default Video;
