import videojs from 'video.js';
import LucidJS from 'js/vendor/lucid.v2-7-0';

videojs.registerPlugin('eventEmitter', function () {
  if (!this.emitter) {
    this.emitter = LucidJS.emitter();
  }
});
