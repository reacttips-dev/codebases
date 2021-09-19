import debounce from 'lodash.debounce';

import { REACT_CONTAINER_ID } from 'constants/appConstants';

export default class LatencyTracking {
  constructor() {
    this.p = window.performance;
    this.observer = null;
    this.pNowOffset = 0;
    this.imgsLoaded = 0;
    this.clientRouted = false;
    this.beaconSent = false;
    this.viewportImgs = [];
    this.performanceParams = [];
    this.navigationType = {
      0: 'navigate', // link, bookmark, form submission, address bar
      1: 'reload',
      2: 'history', // back or forward button
      255: 'reserved'
    };

    // monitor root during locationchange to get new images; debounce observer since we have no idea how many times this can be called
    // let's assume one second of no activitiy indicates no more updates, see MutationObserver: https://soasta.github.io/boomerang/doc/api/SPA.html
    this.mutationThreshold = 1000;
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const mutationCallback = () => {
      this.observer.disconnect();
      this.getAboveTheFoldImages();
    };

    if (this.p) {// Only run if we actually have window.performance
      this.observer = new MutationObserver(debounce(mutationCallback, this.mutationThreshold));

      this.getAboveTheFoldImages();// fire for initial load
    }
  }

  triggerSoftNavigation = () => {
    if (!this.p) {
      return;
    }
    this.imgsLoaded = 0;
    this.viewportImgs = [];
    this.clientRouted = true;
    this.beaconSent = false;
    this.performanceParams = [];
    this.pNowOffset = this.p.now();
    this.observer.observe(document.getElementById(REACT_CONTAINER_ID), { childList: true, subtree: true });
  };

  getAboveTheFoldImages = () => {
    const imgs = document.images;
    const { innerWidth, innerHeight } = window;

    for (let i = 0, len = imgs.length; i < len; ++i) {
      const img = imgs[i];
      const coords = img.getBoundingClientRect();

      // check if img within viewport (and is visible)
      if (coords.bottom >= 0 && coords.top <= innerHeight && coords.right >= 0 && coords.left < innerWidth && window.getComputedStyle(img).visibility !== 'hidden') {
        this.viewportImgs.push(img);
      }
    }

    this.viewportImgs.forEach(this.checkImg);
  };

  checkImg = img => {
    if (img.complete) {
      this.countImg(img);
    } else {
      img.addEventListener('load', this.countImg.bind(null, img));
      img.addEventListener('error', this.countImg.bind(null, img));
    }
  };

  countImg = img => {
    img.removeEventListener('load', this.countImg);
    img.removeEventListener('error', this.countImg);

    if (++this.imgsLoaded >= this.viewportImgs.length) {
      this.trackPerformance();
    }
  };

  trackPerformance = () => {
    // above the fold image load (performance.now() is measured in milliseconds, accurate to five thousandths of a millisecond (5 microseconds))
    let pNow = this.p.now() - this.pNowOffset;

    // observer is debounced, subtract the "wait" threshold from final value
    if (this.clientRouted) {
      pNow -= this.mutationThreshold;
      this.performanceParams.push(`navigationStart=${this.pNowOffset}`);
      this.performanceParams.push(`responseStart=${this.pNowOffset}`);
    }

    // why use navigationStart? all performance.timing properties are based on the UNIX epoch starting from navigationStart, but performance.now() is in milliseconds (from navigationStart), so create a new entry from that epoch
    const atfLoaded = (this.clientRouted ? this.pNowOffset : this.p.timing.navigationStart) + pNow;

    // mPulse calculates Page Load time = loadEventStart - navigationStart (and performance.now is based on navigationStart)  https://community.akamai.com/community/web-performance/blog/2016/08/25/using-navigation-timing-apis-to-understand-your-webpage
    // why global? `aboveTheFold` is defined as a custom timer in mPulse (and needs to be in ms): https://community.akamai.com/docs/DOC-8504-mpulse-custom-and-navigation-timers
    window.aboveTheFoldLoaded = pNow;

    this.performanceParams.push(`aboveTheFoldLoaded=${atfLoaded}`);

    if (window.zfc) {
      if (this.clientRouted) {
        this.sendBeacon();
      } else {
        window.addEventListener('load', this.sendBeacon);
        window.addEventListener('unload', this.sendBeacon);
      }
    }
  };

  sendBeacon = () => {
    if (this.beaconSent || !this.p) {
      return;
    }

    // add in window.performance.timing key/values
    if (!this.clientRouted) {
      const performanceKeys = this.p.timing;
      for (const key in performanceKeys) {
        if (typeof performanceKeys[key] === 'number') {
          this.performanceParams.push(`${key}=${performanceKeys[key]}`);
        }
      }

      // cleanup
      window.removeEventListener('load', this.sendBeacon);
      window.removeEventListener('unload', this.sendBeacon);
    }

    this.performanceParams.push('type=windowPerfTiming');
    this.performanceParams.push(`pageViewType=${this.clientRouted ? 'soft' : 'hard'}`);
    this.performanceParams.push(`page=${((!this.clientRouted && window.zfcUPU) || document.location.pathname)}`);
    this.performanceParams.push(`navigationType=${(this.navigationType[this.p.navigation.type] || this.navigationType[0])}`);
    this.performanceParams.push(`elementCount=${document.getElementsByTagName('*').length}`);
    this.performanceParams.push(`imgCount=${document.images.length}`);
    this.performanceParams.push(`scriptCount=${document.scripts.length}`);

    const url = `/martypixel?${this.performanceParams.join('&')}`;

    // sendBeacon is guaranteed to queue in browser on load/unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      const img = new Image(1, 1);
      img.src = url;
    }

    this.beaconSent = true;
  };

}
