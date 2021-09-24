const MINIMUM_EDITABLE_WIDTH = 82;
const MAXIMUM_SEGMENT_WIDTH_FOR_PENCIL = 120;
/**
 *  @since 4.0.0
 *
 * (Single) Region plugin class
 *
 * Must be turned into an observer before instantiating. This is done in
 * `RegionsPlugin` (main plugin class).
 *
 * @extends {Observer}
 */
export class Segment {
  constructor(params, regionsUtils, ws) {
    this.wavesurfer = ws;
    this.wrapper = ws.drawer.wrapper;
    this.util = ws.util;
    this.style = this.util.style;
    this.regionsUtil = regionsUtils;

    this.id = params.id == null ? ws.util.getId() : params.id;
    this.start = Number(params.start) || 0;
    this.end =
      params.end == null
        ? // small marker-like region
          this.start +
          (4 / this.wrapper.scrollWidth) * this.wavesurfer.getDuration()
        : Number(params.end);
    this.resize = params.resize === undefined ? true : Boolean(params.resize);
    this.drag = params.drag === undefined ? true : Boolean(params.drag);
    // reflect resize and drag state of region for segment-updated listener
    this.isResizing = false;
    this.isDragging = false;
    this.loop = Boolean(params.loop);
    this.color = params.color || 'hsla(0, 2%, 1%, 0)';
    // The left and right handleStyle properties can be set to 'none' for
    // no styling or can be assigned an object containing CSS properties.
    this.handleStyle = params.handleStyle || {
      left: {
        width: '2px',
        backgroundColor: '#5000b9',
      },
      right: {},
    };
    this.handleLeftEl = null;
    this.handleRightEl = null;
    this.data = params.data || {};
    this.attributes = params.attributes || {
      deleted: false,
      minimized: false,
    };

    this.maxLength = params.maxLength;
    this.minLength = params.minLength;
    this._onRedraw = () => this.updateRender();

    this.scroll = params.scroll !== false && ws.params.scrollParent;
    this.scrollSpeed = params.scrollSpeed || 1;
    this.scrollThreshold = params.scrollThreshold || 10;
    // Determines whether the context menu is prevented from being opened.
    this.preventContextMenu =
      params.preventContextMenu === undefined
        ? false
        : Boolean(params.preventContextMenu);

    // select channel ID to set region
    const channelIdx =
      params.channelIdx == null ? -1 : parseInt(params.channelIdx, 10);
    this.regionHeight = '100%';
    this.marginTop = '0px';

    this.prevSegment = params.prevSegment || null;
    this.nextSegment = params.nextSegment || null;
    this.toBeDeleted = params.toBeDeleted || false;
    this.isMinimized = false;
    this.caption = params.caption || '';
    this.editedCaption = false;

    if (channelIdx !== -1) {
      const channelCount =
        this.wavesurfer.backend.buffer != null
          ? this.wavesurfer.backend.buffer.numberOfChannels
          : -1;
      if (channelCount >= 0 && channelIdx < channelCount) {
        this.regionHeight = `${Math.floor((1 / channelCount) * 100)}%`;
        this.marginTop = `${this.wavesurfer.getHeight() * channelIdx}px`;
      }
    }

    this.formatTimeCallback = params.formatTimeCallback;

    this.bindInOut();
    this.render();
    this.wavesurfer.on('zoom', this._onRedraw);
    this.wavesurfer.on('redraw', this._onRedraw);
    this.wavesurfer.fireEvent('segment-created', this);
  }

  /* Update region params. */
  update(params) {
    if (params.start != null) {
      this.start = Number(params.start);
    }
    if (params.end != null) {
      this.end = Number(params.end);
    }
    if (params.loop != null) {
      this.loop = Boolean(params.loop);
    }
    if (params.color != null) {
      this.color = params.color;
    }
    if (params.handleStyle != null) {
      this.handleStyle = params.handleStyle;
    }
    if (params.data != null) {
      this.data = params.data;
    }
    if (params.resize != null) {
      this.resize = Boolean(params.resize);
      this.updateHandlesResize(this.resize);
    }
    if (params.drag != null) {
      this.drag = Boolean(params.drag);
    }
    if (params.maxLength != null) {
      this.maxLength = Number(params.maxLength);
    }
    if (params.minLength != null) {
      this.minLength = Number(params.minLength);
    }
    if (params.attributes != null) {
      this.attributes = params.attributes;
    }
    if (params.nextSegment != null) {
      this.nextSegment = params.nextSegment;
    }
    if (params.prevSegment != null) {
      this.prevSegment = params.prevSegment;
    }
    if (params.toBeDeleted != null) {
      this.toBeDeleted = params.toBeDeleted;
    }

    this.updateRender();
    this.fireEvent('update');
    this.wavesurfer.fireEvent('segment-updated', this);
  }

  /* Remove a single region. */
  remove() {
    if (this.element) {
      this.wrapper.removeChild(this.element);
      this.element = null;
      this.fireEvent('remove');
      this.wavesurfer.un('zoom', this._onRedraw);
      this.wavesurfer.un('redraw', this._onRedraw);
      this.wavesurfer.fireEvent('segmentremoved', this);

      if (this.prevSegment)
        this.prevSegment.update({
          end: this.end,
          next: this.nextSegment,
        });
      if (this.nextSegment)
        this.nextSegment.update({
          prevSegment: this.prevSegment,
        });
    }
  }

  /**
   * Play the audio region.
   * @param {number} start Optional offset to start playing at
   */
  play(start) {
    const s = start || this.start;
    this.wavesurfer.play(s, this.end);
    this.fireEvent('play');
    this.wavesurfer.fireEvent('segment-play', this);
  }

  /**
   * Play the audio region in a loop.
   * @param {number} start Optional offset to start playing at
   * */
  playLoop(start) {
    this.loop = true;
    this.play(start);
  }

  /**
   * Set looping on/off.
   * @param {boolean} loop True if should play in loop
   */
  setLoop(loop) {
    this.loop = loop;
  }

  /* Render a region as a DOM element. */
  render() {
    const segmentEl = document.createElement('region');

    segmentEl.className = 'wave-segment';
    segmentEl.title = this.formatTime(this.start, this.end);
    segmentEl.setAttribute('data-id', this.id);

    Object.entries(this.attributes).forEach(([key, value]) => {
      segmentEl.setAttribute(`data-segment-${key}`, value);
    });

    this.style(segmentEl, {
      position: 'absolute',
      zIndex: 2,
      height: this.regionHeight,
      top: this.marginTop,
    });

    /* Resize handles */
    if (this.resize) {
      const handleLeft = segmentEl.appendChild(
        document.createElement('handle')
      );
      const handleRight = segmentEl.appendChild(
        document.createElement('handle')
      );

      handleLeft.className = 'wave-handle wave-handle-start';
      handleRight.className = 'wave-handle wave-handle-end';

      // Default CSS properties for both handles.
      const css = {
        cursor: 'col-resize',
        position: 'absolute',
        bottom: '11px',
        width: '2px',
        height: '94%',
        backgroundColor: 'rgba(0, 0, 0, 1)',
      };

      // Merge CSS properties per handle.
      const handleLeftCss =
        this.handleStyle.left !== 'none'
          ? Object.assign(
              { left: '0px', display: this.start === 0 ? 'none' : '' },
              css,
              this.handleStyle.left
            )
          : null;
      const handleRightCss =
        this.handleStyle.right !== 'none'
          ? Object.assign(
              css,
              {
                right: '0px',
                width: '0px !important',
                display:
                  this.end === this.wavesurfer.getDuration() ? 'none' : '',
              },
              this.handleStyle.right
            )
          : null;

      if (handleLeftCss) {
        this.style(handleLeft, handleLeftCss);
      }

      if (handleRightCss) {
        this.style(handleRight, handleRightCss);
      }

      this.startHandlerEl = handleLeft;
      this.endHandlerEl = handleRight;
    }

    const dragHandler = segmentEl.appendChild(document.createElement('button'));
    dragHandler.innerHTML = `
      <svg style="pointer-events: none;"width="18" height="18" viewBox="0 0 30 25" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 12.0666C0 5.47465 5.32662 0.121689 11.9185 0.0891775L17.9484 0.0594383C24.5947 0.026659 30 5.40539 30 12.0518C30 18.675 24.6308 24.0442 18.0075 24.0442H11.9776C5.36255 24.0442 0 18.6817 0 12.0666Z" fill="#5000b9"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1409 8.59005C16.8585 8.35548 16.4307 8.55628 16.4307 8.92337V14.7926C16.4307 15.1597 16.8585 15.3605 17.1409 15.1259L20.6733 12.1913C20.8819 12.018 20.8819 11.6979 20.6733 11.5247L17.1409 8.59005Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9343 15.1259C13.2167 15.3605 13.6445 15.1597 13.6445 14.7926V8.92335C13.6445 8.55627 13.2167 8.35546 12.9343 8.59004L9.40187 11.5247C9.1933 11.6979 9.1933 12.018 9.40187 12.1913L12.9343 15.1259Z" fill="white"/>
      </svg>
    `;
    this.style(dragHandler, {
      padding: '0',
      position: 'absolute',
      left: '-8px',
      top: '3px',
      display: 'none',
      cursor: 'col-resize',
    });
    dragHandler.className = 'wave-handle-drag';
    dragHandler.addEventListener('mousedown', this.onDown);
    dragHandler.addEventListener('touchstart', this.onDown);
    this.dragHandlerEl = dragHandler;

    const removeBtn = segmentEl.appendChild(document.createElement('button'));
    removeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C3.15 0 0 3.15 0 7C0 10.85 3.15 14 7 14C10.85 14 14 10.85 14 7C14 3.15 10.85 0 7 0Z" fill="#5000b9"/>
        <path opacity="0.9" fill-rule="evenodd" clip-rule="evenodd" d="M10 9.16L9.16 10L7 7.84L4.84 10L4 9.16L6.16 7L4 4.84L4.84 4L7 6.16L9.16 4L10 4.84L7.84 7L10 9.16Z" fill="white"/>
      </svg>
    `;
    removeBtn.className = 'wave-handle-remove';
    this.style(removeBtn, {
      display: this.start === 0 ? 'none' : '',
    });
    removeBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      this.remove();
    });
    this.removeBtnEl = removeBtn;

    const minimizedBtn = segmentEl.appendChild(
      document.createElement('button')
    );
    minimizedBtn.className = 'wave-minimized';
    minimizedBtn.innerText = '';
    minimizedBtn.addEventListener('click', () => {
      this.wavesurfer.seekAndCenter(this.start / this.wavesurfer.getDuration());
      this.wavesurfer.zoom(
        Math.max(60, this.wavesurfer.params.minPxPerSec * 1.5)
      );
    });
    this.minimizedBtnEl = minimizedBtn;

    const deleteBtn = segmentEl.appendChild(document.createElement('button'));
    const restoreSvg = `<svg aria-hidden="true" width="24" height="24" enable-background="new 0 0 32 32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#fff"><circle cx="16" cy="16" fill="none" r="15" stroke-opacity=".5" stroke-width="2"/>
    <path d="m18.2 12.6h-4.8v-1.8c0-.1 0-.3-.1-.4s-.2-.2-.3-.3c0-.1-.1-.1-.3-.1-.1 0-.3 0-.4.1l-3 2.2c-.1.1-.2.2-.3.3v.4c0 .1 0 .3.1.4l.3.3 3 2.3c.1.1.2.1.4.1.1 0 .3 0 .4-.1s.2-.2.3-.3.1-.2.1-.4v-1.8h4.8c.5 0 1.1.1 1.6.3s.9.5 1.3.9.6.8.8 1.3.3 1 .2 1.6c-.1 1-.6 1.9-1.3 2.6s-1.7 1-2.7 1h-7.2c-.1 0-.2 0-.3.1s-.1.2-.1.3 0 .2.1.3.2.1.3.1h7.2c1.2 0 2.4-.4 3.3-1.2s1.5-1.9 1.6-3.1c.1-.7 0-1.3-.2-1.9s-.5-1.2-1-1.7c-.4-.5-1-.9-1.6-1.1-.8-.3-1.5-.4-2.2-.4z" fill="#fff" stroke-miterlimit="10" stroke-width=".75"/></g>
    </svg><span>Restore</span>`;
    const deleteSvg = `<svg aria-hidden="true" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.5596 11.9549H10.0094C9.36293 11.7825 8.88885 11.2007 8.88885 10.4896V10.0155C8.88885 9.17512 9.55687 8.50711 10.3973 8.50711H12.6599C12.6599 7.23573 13.6942 6.20139 14.9656 6.20139H16.6249C17.8963 6.20139 18.9306 7.23573 18.9306 8.50711H21.1717C22.0121 8.50711 22.6801 9.17512 22.6801 10.0155V10.4896C22.6801 11.2007 22.206 11.7825 21.5596 11.9549ZM16.6029 7.51587H14.9437C14.405 7.51587 13.9524 7.96839 13.9309 8.52866H17.6157C17.6157 7.96839 17.1632 7.51587 16.6029 7.51587Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.6282 23.9792H12.9393C11.4093 23.9792 10.1379 22.7078 10.1379 21.6088V13.0324H21.4295V21.1778C21.4295 22.7293 20.1797 23.9792 18.6282 23.9792ZM18.8658 15.5104H17.5729V21.1131H18.8658V15.5104ZM15.1375 15.5104H16.4304V21.1131H15.1375V15.5104ZM13.9947 15.5104H12.7018V21.1131H13.9947V15.5104Z" fill="white"/>
<circle cx="16" cy="16" r="15" stroke="white" stroke-opacity="0.4" stroke-width="2"/>
</svg><span>Delete</span>
`;
    deleteBtn.innerHTML = deleteSvg;
    deleteBtn.className = 'wave-handle-delete';
    this.deleteBtnEl = deleteBtn;
    deleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      if (this.toBeDeleted === false) {
        this.toBeDeleted = true;
        this.attributes = {
          ...this.attributes,
          deleted: true,
        };
        this.deleteBtnEl.innerHTML = restoreSvg;
        this.color = 'rgba(0, 0, 0, 0.3)';
      } else if (this.toBeDeleted === true) {
        this.toBeDeleted = false;
        this.attributes = {
          ...this.attributes,
          deleted: false,
        };
        this.deleteBtnEl.innerHTML = deleteSvg;
        this.color = 'transparent';
      }
      this.wavesurfer.fireEvent('segment-updated', this);
      this.updateRender();
    });

    const editBtn = segmentEl.appendChild(document.createElement('button'));
    const editSvg = `<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" stroke="#fff" stroke-opacity=".4" stroke-width="2"/><path clip-rule="evenodd" d="m16.0366 6.35724 1.6064 1.60758c.2272.22733.357.53586.357.86062s-.1298.63329-.357.86062l-6.9934 6.99864c-.146.1462-.3245.2436-.5192.3085l-3.39129.9906c-.04868.0162-.11358.0162-.16226.0162-.14604 0-.29207-.0487-.40566-.1624-.14603-.1624-.21094-.3735-.14603-.5683l.98979-3.3938c.0649-.1949.16226-.3735.30829-.5196l6.99346-6.99866c.2271-.22733.5354-.35724.86-.35724.3245 0 .6328.12991.8599.35724zm-.3083 3.63735 1.1034-1.10419c.0162-.01624.0325-.03248.0325-.04872s0-.04871-.0163-.06495l-1.6063-1.60758c-.0325-.01624-.0487-.01624-.0649-.01624-.0163 0-.0487 0-.0649.01624l-1.1034 1.1042z" fill="#fff" fill-rule="evenodd"/></svg>
`;
    editBtn.innerHTML = editSvg;
    editBtn.className = 'wave-handle-edit';
    this.style(editBtn, {
      position: 'absolute',
      top: '7px',
      left: '10px',
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '1.6rem',
      display: 'none',
    });
    editBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      this.style(this.labelInputEl, {
        display: 'block',
      });
      this.labelInputEl.focus();
    });
    this.editBtnEl = editBtn;

    const labelInput = segmentEl.appendChild(
      document.createElement('textarea')
    );
    labelInput.setAttribute('spellCheck', 'false');
    labelInput.value = this.caption || this.id;
    labelInput.className = 'wave-handle-input';
    this.style(labelInput, {
      position: 'absolute',
    });
    labelInput.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
    });
    labelInput.addEventListener('change', e => {
      e.stopPropagation();
      e.preventDefault();
      this.caption = e.target.value;
      this.editedCaption = true;
    });
    labelInput.addEventListener('focus', e => {
      e.stopPropagation();
      e.preventDefault();
      this.labelInputEl.value = this.caption;
      this.style(this.editBtnEl, {
        opacity: 0,
      });
      this.style(this.deleteBtnEl, {
        opacity: 0,
      });
    });
    labelInput.addEventListener('blur', e => {
      e.stopPropagation();
      e.preventDefault();
      this.style(this.editBtnEl, {
        opacity: 1,
      });
      this.style(this.deleteBtnEl, {
        opacity: 1,
      });
      this.updateRender();
    });
    labelInput.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        labelInput.blur();
        this.style(this.editBtnEl, {
          opacity: 1,
        });
        this.style(this.deleteBtnEl, {
          opacity: 1,
        });
        this.updateRender();
      }
    });
    this.labelInputEl = labelInput;

    this.element = this.wrapper.appendChild(segmentEl);
    this.updateRender();
    this.bindEvents(segmentEl);
  }

  formatTime(start, end) {
    if (this.formatTimeCallback) {
      return this.formatTimeCallback(start, end);
    }
    return (start == end ? [start] : [start, end])
      .map(time =>
        [
          Math.floor((time % 3600) / 60), // minutes
          `00${Math.floor(time % 60)}`.slice(-2), // seconds
        ].join(':')
      )
      .join('-');
  }

  getWidth() {
    return this.wavesurfer.drawer.width / this.wavesurfer.params.pixelRatio;
  }

  canDeleteSegment(segment) {
    const { element } = segment || {};
    return (
      !!element && parseInt(element.style.width, 10) > MINIMUM_EDITABLE_WIDTH
    );
  }

  minimizeHandlers() {
    const duration =
      this.wavesurfer.timeline.params.duration ||
      this.wavesurfer.backend.getDuration();

    const width = this.getWidth();
    const pixelsPerSecond = width / duration;

    const regions = this.wavesurfer.getCustomRegions();
    let chainCount = 0;
    for (let i = 0; i < regions.length; i = i + 1) {
      const currSegment = regions[i];
      // reset if pxPerSecond is large enough to show safely
      if (pixelsPerSecond > 60) {
        chainCount = 0;
        currSegment.isMinimized = false;
        this.attributes = {
          ...this.attributes,
          minimized: false,
        };
        // move to CSS
        this.style(currSegment.minimizedBtnEl, {
          display: 'none',
        });
        this.style(currSegment.labelInputEl, {
          opacity: '1',
        });
        this.style(currSegment.deleteBtnEl, {
          display: this.canDeleteSegment(currSegment) ? 'block' : 'none',
        });
        this.style(currSegment.endHandlerEl, {
          display: 'block',
        });

        if (i === 0)
          this.style(currSegment.removeBtnEl, {
            display: 'none',
          });
        if (i !== 0) {
          this.style(currSegment.startHandlerEl, {
            width: '2px',
          });
          this.style(currSegment.removeBtnEl, {
            display: 'block',
          });
          this.style(currSegment.dragHandlerEl, {
            display: 'block',
          });
        }
        if (i === regions.length - 1)
          this.style(currSegment.endHandlerEl, {
            display: 'none',
          });
      }
      if (
        currSegment.nextSegment &&
        (currSegment.nextSegment.start - currSegment.start) * pixelsPerSecond <
          20
      ) {
        currSegment.isMinimized = true;
        this.attributes = {
          ...this.attributes,
          minimized: true,
        };
        this.style(currSegment.minimizedBtnEl, {
          display: 'none',
        });

        this.style(currSegment.startHandlerEl, {
          width: '0',
        });

        const hideEnd =
          (currSegment.nextSegment.start - currSegment.start) *
            pixelsPerSecond <
          10;
        this.style(currSegment.endHandlerEl, {
          display: hideEnd ? 'none' : 'block',
        });
        this.style(currSegment.labelInputEl, {
          opacity: '0',
        });
        this.style(currSegment.removeBtnEl, {
          display: 'none',
        });
        this.style(currSegment.deleteBtnEl, {
          display: 'none',
        });
        this.style(currSegment.dragHandlerEl, {
          display: 'none',
        });

        chainCount = chainCount + 1;
      }
      // else if is too close but in the chain
      else if (
        currSegment.prevSegment &&
        currSegment.prevSegment.isMinimized === true &&
        (currSegment.start - currSegment.prevSegment.start) * pixelsPerSecond <
          20
      ) {
        currSegment.isMinimized = true;

        chainCount = chainCount + 1;

        this.style(currSegment.removeBtnEl, {
          display: 'none',
        });

        this.style(currSegment.startHandlerEl, {
          width: '2px',
        });
        this.style(currSegment.endHandlerEl, {
          display: 'block',
        });
        this.style(currSegment.dragHandlerEl, {
          display: 'block',
        });
        currSegment.minimizedBtnEl.innerText = chainCount;
        this.style(currSegment.minimizedBtnEl, {
          display: 'block',
        });
        chainCount = 0;
      } else {
        chainCount = 0;
        currSegment.isMinimized = false;
        this.attributes = {
          ...this.attributes,
          minimized: false,
        };
        this.style(currSegment.minimizedBtnEl, {
          display: 'none',
        });
        this.style(currSegment.labelInputEl, {
          opacity: '1',
        });
        this.style(currSegment.endHandlerEl, {
          display: 'block',
        });

        if (i === 0)
          this.style(currSegment.removeBtnEl, {
            display: 'none',
          });

        if (i !== 0) {
          this.style(currSegment.startHandlerEl, {
            width: '2px',
          });
          this.style(currSegment.removeBtnEl, {
            display: 'block',
          });
          this.style(currSegment.dragHandlerEl, {
            display: 'block',
          });
        }

        if (i === regions.length - 1)
          this.style(currSegment.endHandlerEl, {
            display: 'none',
          });

        this.style(currSegment.deleteBtnEl, {
          display: this.canDeleteSegment(currSegment) ? 'block' : 'none',
        });
      }
      if (regions.length === 1) {
        this.style(currSegment.deleteBtnEl, {
          display: 'none',
        });
        if (currSegment.toBeDeleted === true) {
          currSegment.deleteBtnEl.click();
        }
      }
    }
  }

  /* Update element's position, width, color. */
  updateRender() {
    // duration varies during loading process, so don't overwrite important data
    const dur = this.wavesurfer.getDuration();
    const width = this.getWidth();

    let startLimited = this.start;
    let endLimited = this.end;
    if (startLimited < 0) {
      startLimited = 0;
      endLimited = endLimited - startLimited;
    }
    if (endLimited > dur) {
      endLimited = dur;
      startLimited = dur - (endLimited - startLimited);
    }

    if (this.minLength != null) {
      endLimited = Math.max(startLimited + this.minLength, endLimited);
    }

    if (this.maxLength != null) {
      endLimited = Math.min(startLimited + this.maxLength, endLimited);
    }

    if (this.element != null) {
      // Calculate the left and width values of the region such that
      // no gaps appear between regions.
      const left = Math.round((startLimited / dur) * width);
      const regionWidth = Math.round((endLimited / dur) * width) - left;

      this.minimizeHandlers();

      this.style(this.element, {
        left: `${left}px`,
        width: `${regionWidth}px`,
        backgroundColor: this.color,
      });

      if (regionWidth < MINIMUM_EDITABLE_WIDTH) {
        this.style(this.editBtnEl, {
          display: 'none',
        });
        this.style(this.labelInputEl, {
          display: 'none',
        });
        this.style(this.deleteBtnEl, {
          display: 'none',
        });
      } else if (
        regionWidth >= MINIMUM_EDITABLE_WIDTH &&
        regionWidth <= MAXIMUM_SEGMENT_WIDTH_FOR_PENCIL
      ) {
        this.style(this.editBtnEl, {
          display: 'block',
        });
        this.style(this.labelInputEl, {
          display: 'none',
        });
      } else if (regionWidth > MAXIMUM_SEGMENT_WIDTH_FOR_PENCIL) {
        this.style(this.editBtnEl, {
          display: 'none',
        });
        this.style(this.labelInputEl, {
          display: 'block',
        });
      }

      Object.entries(this.attributes).forEach(([key, value]) => {
        this.element.setAttribute(`data-segment-${key}`, value);
      });

      this.element.title = `${this.caption} : ${this.formatTime(
        this.start,
        this.end
      )}`;

      if (this.caption.length > 20) {
        this.labelInputEl.value = `${this.caption.substring(
          0,
          Math.min(20, Math.floor(regionWidth / 18))
        )}...`;
      } else {
        this.labelInputEl.value = this.caption;
      }
    }
  }

  /* Bind audio events. */
  bindInOut() {
    this.firedIn = false;
    this.firedOut = false;

    const onProcess = time => {
      const start = Math.round(this.start * 10) / 10;
      const end = Math.round(this.end * 10) / 10;
      const roundedTime = Math.round(time * 10) / 10;

      if (
        !this.firedOut &&
        this.firedIn &&
        (start > roundedTime || end <= roundedTime)
      ) {
        this.firedOut = true;
        this.firedIn = false;
        this.fireEvent('out');
        this.wavesurfer.fireEvent('segment-out', this);
      }
      if (!this.firedIn && start <= roundedTime && end > roundedTime) {
        this.firedIn = true;
        this.firedOut = false;
        this.fireEvent('in');
        this.wavesurfer.fireEvent('segment-in', this);
      }
    };

    this.wavesurfer.backend.on('audioprocess', onProcess);

    this.on('remove', () => {
      this.wavesurfer.backend.un('audioprocess', onProcess);
    });

    /* Loop playback. */
    this.on('out', () => {
      if (this.loop) {
        const realTime = this.wavesurfer.getCurrentTime();
        if (realTime >= this.start && realTime <= this.end) {
          this.wavesurfer.play(this.start);
        }
      }
    });
  }

  /* Bind DOM events. */
  bindEvents() {
    const { preventContextMenu } = this;

    this.element.addEventListener('mouseenter', e => {
      this.fireEvent('mouseenter', e);
      this.wavesurfer.fireEvent('segment-mouseenter', this, e);
    });

    this.element.addEventListener('mouseleave', e => {
      this.fireEvent('mouseleave', e);
      this.wavesurfer.fireEvent('segment-mouseleave', this, e);
    });

    this.element.addEventListener('click', e => {
      // e.stopPropagation();
      e.preventDefault();
      this.fireEvent('click', e);
      this.wavesurfer.fireEvent('segment-click', this, e);
    });

    this.element.addEventListener('dblclick', e => {
      // e.stopPropagation();
      e.preventDefault();
      this.fireEvent('dblclick', e);
      this.wavesurfer.fireEvent('segment-dblclick', this, e);
    });

    this.element.addEventListener('contextmenu', e => {
      if (preventContextMenu) {
        e.preventDefault();
      }
      this.fireEvent('contextmenu', e);
      this.wavesurfer.fireEvent('segment-contextmenu', this, e);
    });

    /* Drag or resize on mousemove. */
    if (this.drag || this.resize) {
      this.bindDragEvents();
    }
  }

  bindDragEvents() {
    const { container } = this.wavesurfer.drawer;
    const { scrollSpeed, scrollThreshold } = this;
    let startTime;
    let touchId;
    let drag;
    let maxScroll;
    let resize;
    let updated = false;
    let scrollDirection;
    let wrapperRect;
    let regionLeftHalfTime;
    let regionRightHalfTime;

    // Scroll when the user is dragging within the threshold
    const edgeScroll = e => {
      const duration = this.wavesurfer.getDuration();
      if (!scrollDirection || (!drag && !resize)) {
        return;
      }

      // Update scroll position
      let scrollLeft = this.wrapper.scrollLeft + scrollSpeed * scrollDirection;
      scrollLeft = Math.min(maxScroll, Math.max(0, scrollLeft));
      this.wrapper.scrollLeft = scrollLeft;

      // Get the currently selected time according to the mouse position
      const time = this.regionsUtil.getRegionSnapToGridValue(
        this.wavesurfer.drawer.handleEvent(e) * duration
      );
      const delta = time - startTime;
      startTime = time;

      // Continue dragging or resizing
      if (drag) this.onDrag(delta);
      else this.onResize(delta, resize);

      // Repeat
      window.requestAnimationFrame(() => {
        edgeScroll(e);
      });
    };

    const onDown = e => {
      const duration = this.wavesurfer.getDuration();
      if (e.touches && e.touches.length > 1) {
        return;
      }
      touchId = e.targetTouches ? e.targetTouches[0].identifier : null;

      // stop the event propagation, if this region is resizable or draggable
      // and the event is therefore handled here.
      if (this.drag || this.resize) {
        e.stopPropagation();
      }

      // Store the selected startTime we begun dragging or resizing
      startTime = this.regionsUtil.getRegionSnapToGridValue(
        this.wavesurfer.drawer.handleEvent(e, true) * duration
      );

      // Store the selected point of contact when we begin dragging
      regionLeftHalfTime = startTime - this.start;
      regionRightHalfTime = this.end - startTime;

      // Store for scroll calculations
      maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;
      wrapperRect = this.wrapper.getBoundingClientRect();

      this.isResizing = false;
      this.isDragging = false;
      if (
        e.target.tagName.toLowerCase() === 'handle' ||
        e.target.classList.contains('wave-handle-drag')
      ) {
        this.isResizing = true;
        resize =
          e.target.classList.contains('wave-handle-start') ||
          e.target.classList.contains('wave-handle-drag')
            ? 'start'
            : 'end';

        this.style(this.startHandlerEl, {
          cursor: 'grabbing',
        });
        this.style(this.wrapper, {
          cursor: 'grabbing',
        });
        if (this.prevSegment)
          this.style(this.prevSegment.deleteBtnEl, {
            opacity: '0',
          });
      } else {
        resize = false;
      }
    };
    const onUp = e => {
      if (e.touches && e.touches.length > 1) {
        return;
      }

      if (drag || resize) {
        this.isDragging = false;
        this.isResizing = false;

        this.style(this.startHandlerEl, {
          cursor: 'col-resize',
        });
        this.style(this.wrapper, {
          cursor: 'crosshair',
        });

        drag = false;
        scrollDirection = null;
        resize = false;
      }

      if (updated) {
        updated = false;
        this.util.preventClick();
        this.fireEvent('update-end', e);
        this.wavesurfer.fireEvent('segment-update-end', this, e);

        if (this.prevSegment) {
          this.style(this.prevSegment.deleteBtnEl, {
            opacity: '1',
            display: this.canDeleteSegment(this.prevSegment) ? 'block' : 'none',
          });
        }
      }
    };
    const onMove = e => {
      if (!this.wavesurfer.isReady) {
        return;
      }
      const duration = this.wavesurfer.getDuration();

      if (e.touches && e.touches.length > 1) {
        return;
      }
      if (e.targetTouches && e.targetTouches[0].identifier != touchId) {
        return;
      }
      if (!drag && !resize) {
        return;
      }

      const oldTime = startTime;
      let time = this.regionsUtil.getRegionSnapToGridValue(
        this.wavesurfer.drawer.handleEvent(e) * duration
      );

      if (drag) {
        // To maintain relative cursor start point while dragging
        const maxEnd = this.wavesurfer.getDuration();
        if (time > maxEnd - regionRightHalfTime) {
          time = maxEnd - regionRightHalfTime;
        }

        if (time - regionLeftHalfTime < 0) {
          time = regionLeftHalfTime;
        }
      }

      if (resize) {
        // To maintain relative cursor start point while resizing
        // we have to handle for minLength
        let { minLength } = this;
        if (!minLength) {
          minLength = 0;
        }

        if (resize === 'start') {
          if (time > this.end - minLength) {
            time = this.end - minLength;
          }

          if (time < 0) {
            time = 0;
          }
        } else if (resize === 'end') {
          if (time < this.start + minLength) {
            time = this.start + minLength;
          }

          if (time > duration) {
            time = duration;
          }
        }
      }

      const delta = time - startTime;
      startTime = time;

      // Drag
      if (this.drag && drag) {
        updated = updated || !!delta;
        this.onDrag(delta);
      }

      // Resize
      if (this.resize && resize) {
        updated = updated || !!delta;
        this.onResize(delta, resize);
      }

      if (this.scroll && container.clientWidth < this.wrapper.scrollWidth) {
        if (drag) {
          // The threshold is not between the mouse and the container edge
          // but is between the region and the container edge
          const regionRect = this.element.getBoundingClientRect();
          const x = regionRect.left - wrapperRect.left;

          // Check direction
          if (time < oldTime && x >= 0) {
            scrollDirection = -1;
          } else if (
            time > oldTime &&
            x + regionRect.width <= wrapperRect.right
          ) {
            scrollDirection = 1;
          }

          // Check that we are still beyond the threshold
          if (
            (scrollDirection === -1 && x > scrollThreshold) ||
            (scrollDirection === 1 &&
              x + regionRect.width < wrapperRect.right - scrollThreshold)
          ) {
            scrollDirection = null;
          }
        } else {
          // Mouse based threshold
          const x = e.clientX - wrapperRect.left;

          // Check direction
          if (x <= scrollThreshold) {
            scrollDirection = -1;
          } else if (x >= wrapperRect.right - scrollThreshold) {
            scrollDirection = 1;
          } else {
            scrollDirection = null;
          }
        }

        if (scrollDirection) {
          edgeScroll(e);
        }
      }
    };

    this.element.addEventListener('mousedown', onDown);
    this.element.addEventListener('touchstart', onDown);

    document.body.addEventListener('mousemove', onMove);
    document.body.addEventListener('touchmove', onMove);

    document.body.addEventListener('mouseup', onUp);
    document.body.addEventListener('touchend', onUp);

    this.on('remove', () => {
      document.body.removeEventListener('mouseup', onUp);
      document.body.removeEventListener('touchend', onUp);
      document.body.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('touchmove', onMove);
    });

    this.wavesurfer.on('destroy', () => {
      document.body.removeEventListener('mouseup', onUp);
      document.body.removeEventListener('touchend', onUp);
    });
  }

  onDrag(delta) {
    const maxEnd = this.wavesurfer.getDuration();
    let newDelta;
    if (this.end + delta > maxEnd) {
      newDelta = maxEnd - this.end;
    }

    if (this.start + delta < 0) {
      newDelta = this.start * -1;
    }

    this.update({
      start: this.start + newDelta,
      end: this.end + newDelta,
    });
  }

  /**
   * @example
   * onResize(-5, 'start') // Moves the start point 5 seconds back
   * onResize(0.5, 'end') // Moves the end point 0.5 seconds forward
   *
   * @param {number} delta How much to add or subtract, given in seconds
   * @param {string} direction 'start 'or 'end'
   */
  onResize(delta, direction) {
    const duration = this.wavesurfer.getDuration();
    if (direction === 'start') {
      const newPos = Math.min(this.start + delta, this.end);
      const lowerBound = this.prevSegment !== null ? this.prevSegment.start : 0;
      const upperBound =
        this.nextSegment !== null ? this.nextSegment.start : duration;
      if (newPos > lowerBound + 0.1 && newPos < upperBound - 0.1) {
        if (this.nextSegment && newPos === this.nextSegment.start) {
          this.nextSegment.update({
            start: this.prevSegment.end,
            end: newPos,
          });
          this.update({
            start: newPos,
            end: this.nextSegment.end,
          });
        } else if (this.prevSegment && newPos < this.prevSegment.start) {
          this.prevSegment.update({
            end: this.nextSegment ? this.nextSegment.start : this.end,
          });
          this.update({
            start: newPos,
            end: Math.max(newPos, this.prevSegment.start),
          });
        } else {
          if (this.prevSegment && this.prevSegment.end !== newPos)
            this.prevSegment.update({
              end: newPos,
            });
          this.update({
            start: newPos,
          });
        }
      }
    }
  }

  updateHandlesResize(resize) {
    const cursorStyle = resize ? 'col-resize' : 'auto';

    if (this.startHandlerEl)
      this.style(this.startHandlerEl, { cursor: cursorStyle });
    if (this.endHandlerEl)
      this.style(this.endHandlerEl, { cursor: cursorStyle });
  }
}
