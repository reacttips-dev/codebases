import videojs from 'video.js';
import _ from 'underscore';

const Cuepoint = function Cuepoint(player, options, callback) {
  const _options = _(options);
  this.name = _options.has('name') ? options.name : '';
  this.startTime = options.at || 0;
  this.endTime = _options.has('to') ? options.to : 0;
  this.type = _options.has('to') ? Cuepoint.RANGE : Cuepoint.POINT;
  this.callback = callback || function () {};
  this.player = player;
  this.visible = _options.has('visible') && options.visible;
};

Cuepoint.POINT = 0;
Cuepoint.RANGE = 1;

_.extend(Cuepoint.prototype, {
  type: Cuepoint.POINT,
  visible: false,
  marker: null,
  startTime: 0,
  endTime: 0,
  name: '',
  didFire: false,

  move(percent) {
    this.startTime = parseFloat((percent / 100) * this.player.duration()).toFixed(1);
    if (this.marker) {
      this.marker.move(percent);
    }
  },

  filter: function filter(firstTime, secondTime) {
    if (this.type === Cuepoint.POINT) {
      return firstTime < this.startTime && this.startTime <= secondTime;
    } else {
      const startsInRange = firstTime >= this.startTime && firstTime < this.endTime;
      const startsBeforeRange = firstTime < this.startTime;
      const endsInRange = secondTime > this.startTime && secondTime < this.endTime;

      return startsInRange || (startsBeforeRange && endsInRange);
    }
  },

  setFired(fired) {
    this.didFire = fired;
  },

  fire() {
    if (this.name) {
      this.player.emitter.trigger('cuepoint.' + this.name);
    }
    if (this.callback) {
      this.callback();
    }
    this.setFired(true);
  },
});

let cuepoints = [];
let seeking = false;
videojs.registerPlugin('addCuepoint', function (options, callback) {
  this.eventEmitter();

  cuepoints.push(new Cuepoint(this, options, callback));

  this.on('seeking', function () {
    seeking = true;
  });

  this.on('seeked', function () {
    seeking = false;

    const currentTime = this.currentTime();

    _(cuepoints)
      .chain()
      .filter(({ startTime }) => startTime > currentTime)
      .forEach((cuepoint) => {
        cuepoint.setFired(false);
      });
  });

  let oldTime = 0;
  this.on('timeupdate', function () {
    const currentTime = this.currentTime();
    if (!seeking) {
      _(cuepoints)
        .chain()
        .filter(function (cuepoint) {
          return cuepoint.filter(oldTime, currentTime) && !cuepoint.didFire;
        })
        // TODO: deal with cuepoint throttling here
        .invoke('fire');
    }
    oldTime = currentTime;
  });

  this.on('dispose', function () {
    cuepoints = [];
  });
});
