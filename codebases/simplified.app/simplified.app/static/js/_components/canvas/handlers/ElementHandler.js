import { forOwn } from "lodash";
class ElementHandler {
  constructor(handler) {
    this.handler = handler;
  }

  /**
   * Set element by id
   * @param {string} id
   * @param {*} source
   * @returns {void}
   */
  setById = (id, source) => {
    const obj = this.handler.findById(id);
    if (!obj) {
      return;
    }
    this.set(obj, source);
  };

  /**
   * Set element
   * @param {ElementObjectType} obj
   * @param {*} source
   */
  set = (obj, source) => {
    obj.setSource(source);
  };

  /**
   * Find element by id with type
   * @param {string} id
   * @param {ElementType} [type='container']
   * @returns
   */
  findById = (id, type = "container") => {
    return document.getElementById(`${id}_${type}`);
  };

  /**
   * Remove element
   * @param {HTMLElement} el
   * @returns
   */
  remove = (el) => {
    if (!el) {
      return;
    }
    this.handler.container.removeChild(el);
  };

  /**
   * Remove element by id
   * @param {string} id
   */
  removeById = (id) => {
    const el = this.findById(id);
    const scriptEl = this.findById(id, "script");
    const styleEl = this.findById(id, "style");
    if (el) {
      if (el.remove) {
        el.remove();
      } else {
        this.remove(el);
      }
    }
    if (scriptEl) {
      if (scriptEl.remove) {
        scriptEl.remove();
      } else {
        document.head.removeChild(scriptEl);
      }
    }
    if (styleEl) {
      if (styleEl.remove) {
        styleEl.remove();
      } else {
        document.head.removeChild(styleEl);
      }
    }
  };

  /**
   * Remove element by ids
   * @param {string[]} ids
   */
  removeByIds = (ids) => {
    ids.forEach((id) => {
      this.removeById(id);
    });
  };

  /**
   * Set position
   * @param {HTMLElement} el
   * @param {number} left
   * @param {number} top
   * @returns
   */
  setPosition = (el, obj) => {
    if (!el) {
      return;
    }
    obj.setCoords();
    const zoom = this.handler.canvas.getZoom();
    const { scaleX, scaleY, width, height } = obj;
    const { left, top } = obj.getBoundingRect(false);
    const padLeft = (width * scaleX * zoom - width) / 2;
    const padTop = (height * scaleY * zoom - height) / 2;
    el.style.left = `${left + padLeft}px`;
    el.style.top = `${top + padTop}px`;
  };

  setPositionByOrigin = (el, obj, left, top) => {
    if (!el) {
      return;
    }
    obj.setCoords();
    const zoom = this.handler.canvas.getZoom();
    const { scaleX, scaleY, width, height } = obj;
    const padLeft = (width * scaleX * zoom - width) / 2;
    const padTop = (height * scaleY * zoom - height) / 2;
    el.style.left = `${left + padLeft}px`;
    el.style.top = `${top + padTop}px`;
  };

  /**
   * Set size
   * @param {HTMLElement} el
   * @param {number} width
   * @param {number} height
   * @returns
   */
  setSize = (el, obj) => {
    if (!el) {
      return;
    }
    const { width, height } = obj;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
  };

  /**
   * Set scale or angle
   * @param {HTMLElement} el
   * @param {number} scaleX
   * @param {number} scaleY
   * @param {number} angle
   * @returns
   */
  setScaleOrAngle = (el, obj) => {
    if (!el) {
      return;
    }
    const zoom = this.handler.canvas.getZoom();
    const { scaleX, scaleY, angle, flipX = false, flipY = false } = obj;
    el.style.transform = `rotate(${angle}deg) scale(${
      flipX ? -1 * scaleX * zoom : scaleX * zoom
    }, ${flipY ? -1 * scaleY * zoom : scaleY * zoom})`;
  };

  setFilter = (el, obj) => {
    if (!el) {
      return;
    }

    let filter = "";
    if (obj.style.filters) {
      forOwn(obj.style.filters, (obj, key) => {
        filter += `${obj.filter}(${obj.value}) `;
      });
    }

    el.style.filter = filter;
  };

  setCoverById = (id, cover) => {
    const obj = this.handler.findById(id);
    if (!obj) {
      return;
    }
    obj.setCover(cover);
  };
}

export default ElementHandler;
