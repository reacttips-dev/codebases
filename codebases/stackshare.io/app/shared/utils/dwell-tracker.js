const DWELL_TIME = 3000;

export default class DwellTracker {
  _el = null;
  _dwellTimer = null;
  _visible = false;
  _ticking = false;
  _onDwell = null;

  constructor(el, onDwell, dwellTime = DWELL_TIME) {
    this._el = el;
    this._onDwell = onDwell;
    this._dwellTime = dwellTime;

    this.trackDwellTime();
    window.addEventListener('scroll', this.handleScroll, true);
  }

  destroy() {
    clearTimeout(this._dwellTimer);
    this._dwellTimer = null;
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  trackDwellTime() {
    if (!this._visible && this._el) {
      const rect = this._el.getBoundingClientRect();
      if (rect.y > 0 && rect.y + rect.height < window.innerHeight) {
        if (!this._dwellTimer) {
          this._dwellTimer = setTimeout(() => {
            this._visible = true;
            this.destroy();
            this._onDwell(this._dwellTime);
          }, this._dwellTime);
        }
      } else {
        clearTimeout(this._dwellTimer);
        this._dwellTimer = null;
      }
    }
  }

  handleScroll = () => {
    if (!this._ticking) {
      window.requestAnimationFrame(() => {
        this.trackDwellTime();
        this._ticking = false;
      });
      this._ticking = true;
    }
  };
}
