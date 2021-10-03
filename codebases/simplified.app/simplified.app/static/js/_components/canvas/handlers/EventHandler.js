import { fabric } from "fabric";
import {
  ACTIVE_SELECTION,
  ELEMENTS_SLIDER_PANEL,
  FABRIC_CIRCLE_ELEMENT,
  FABRIC_IMAGE_ELEMENT,
  FABRIC_ITEXT_ELEMENT,
  FABRIC_PHOTOTEXT_ELEMENT,
  FABRIC_POLYGON_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
  FABRIC_TEXT_TYPES,
  FONT_BOLD_WEIGHT,
  FONT_REGULAR_WEIGHT,
  ICONS_SLIDER_PANEL,
  IMAGES_SLIDER_PANEL,
  PASTED_URL_SUFFIXES,
  TEXT_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
} from "../../details/constants";
import { CROP_INTERACTION } from "../constants/defaults";
import { forOwn } from "lodash";
import { endsWithAny, isURL } from "../../../_utils/common";
import {
  WORKAREA_LAYOUT_FIXED,
  WORKAREA_LAYOUT_RESPONSIVE,
} from "../../../_utils/constants";
import { debounce } from "lodash";

export default class EventHandler {
  constructor(handler) {
    this.handler = handler;
    this.initialize();
  }

  initialize = () => {
    if (this.handler.editable) {
      this.handler.canvas.on({
        "object:modified": this.modified,
        "text:changed": this.textChanged,
        // "text:event:changed": this.textSelectionChanged,
        "text:selection:changed": this.textSelectionChanged,
        "object:scaling": this.scaling,
        "object:scaled": this.scaled,
        "object:moving": this.moving,
        "object:moved": this.moved,
        "object:rotating": this.rotating,
        "object:rotated": this.rotated,
        "mouse:wheel": this.mousewheel,
        "mouse:down": this.mousedown,
        "mouse:move": this.mousemove,
        "mouse:up": this.mouseup,
        "selection:cleared": this.selectionCleared,
        "selection:created": this.selectionCreated,
        "selection:updated": this.selectionUpdated,
        "object:render:finished": this.objectRenderFinish,
      });
    } else {
      this.handler.canvas.on({
        "mouse:down": this.mousedown,
        "mouse:move": this.mousemove,
        "mouse:out": this.mouseout,
        "mouse:up": this.mouseup,
        "mouse:wheel": this.mousewheel,
      });
    }

    this.handler.canvas.wrapperEl.tabIndex = 1000;
    this.handler.canvas.wrapperEl.addEventListener(
      "keydown",
      this.keydown,
      false
    );
    this.handler.canvas.wrapperEl.addEventListener("keyup", this.keyup, false);
    this.handler.canvas.wrapperEl.addEventListener(
      "mousedown",
      this.onmousedown,
      false
    );
    this.handler.canvas.wrapperEl.addEventListener(
      "contextmenu",
      this.contextmenu,
      false
    );
    if (this.handler.keyEvent.clipboard) {
      document.addEventListener("paste", this.paste, false);
    }
  };

  /**
   * Detach event on document
   *
   */
  destroy = () => {
    if (this.handler.editable) {
      this.handler.canvas.off({
        "object:modified": this.modified,
        "object:scaling": this.scaling,
        "object:moving": this.moving,
        "object:moved": this.moved,
        "object:rotating": this.rotating,
        "mouse:wheel": this.mousewheel,
        "mouse:down": this.mousedown,
        "mouse:move": this.mousemove,
        "mouse:up": this.mouseup,
        "selection:cleared": this.selectionCleared,
        "selection:created": this.selectionCreated,
        "selection:updated": this.selectionUpdated,
      });
    } else {
      this.handler.canvas.off({
        "mouse:down": this.mousedown,
        "mouse:move": this.mousemove,
        "mouse:out": this.mouseout,
        "mouse:up": this.mouseup,
        "mouse:wheel": this.mousewheel,
      });
      this.handler.getObjects().forEach((object) => {
        object.off("mousedown", this.handler.eventHandler.object.mousedown);
        // if (object.anime) {
        // 	anime.remove(object);
        // }
      });
    }
    this.handler.canvas.wrapperEl.removeEventListener("keydown", this.keydown);
    this.handler.canvas.wrapperEl.removeEventListener("keyup", this.keyup);
    this.handler.canvas.wrapperEl.removeEventListener(
      "mousedown",
      this.onmousedown
    );
    this.handler.canvas.wrapperEl.removeEventListener(
      "contextmenu",
      this.contextmenu
    );
    if (this.handler.keyEvent.clipboard) {
      this.handler.canvas.wrapperEl.removeEventListener("paste", this.paste);
    }
  };

  selectionCreated = (opt) => {
    this.selection(opt);
  };

  selectionUpdated = (opt) => {
    this.selection(opt);
  };

  selectionCleared = (opt) => {
    this.selection(opt);
  };

  /**
   * Selection event event on ca3nvas
   *
   * @param {FabricEvent} opt
   */
  selection = (opt) => {
    const { onSelect, activeSelectionOption } = this.handler;
    const target = opt.target;
    if (target && target.type === "activeSelection") {
      target.set({
        ...activeSelectionOption,
      });
    }
    if (onSelect) {
      onSelect(target);
    }
  };

  /**
   * Mouse down event on object
   *
   * @param {FabricEvent<MouseEvent>} opt
   * @returns
   */
  mousedown = (opt) => {
    const event = opt;
    const { editable } = this.handler;

    if (this.handler.interactionMode === "grab") {
      this.panning = true;
      return;
    }
    const { target } = event;
    if (editable) {
      if (
        this.handler.prevTarget &&
        this.handler.prevTarget.superType === "link"
      ) {
        this.handler.prevTarget.set({
          stroke: this.handler.prevTarget.originStroke,
        });
      }
      if (target && target.type === "fromPort") {
        this.handler.linkHandler.init(target);
        return;
      }
      if (
        target &&
        this.handler.interactionMode === "link" &&
        (target.type === "toPort" || target.superType === "node")
      ) {
        let toPort;
        if (target.superType === "node") {
          toPort = target.toPort;
        } else {
          toPort = target;
        }
        this.handler.linkHandler.generate(toPort);
        return;
      }
      this.handler.guidelineHandler.viewportTransform =
        this.handler.canvas.viewportTransform;
      this.handler.guidelineHandler.zoom = this.handler.canvas.getZoom();
      if (this.handler.interactionMode === "selection") {
        if (target && target.superType === "link") {
          target.set({
            stroke: target.selectFill || "green",
          });
        }
        this.handler.prevTarget = target;
        return;
      }
      if (this.handler.interactionMode === FABRIC_POLYGON_ELEMENT) {
        if (
          target &&
          this.handler.pointArray.length &&
          target.id === this.handler.pointArray[0].id
        ) {
          this.handler.drawingHandler.polygon.generate(this.handler.pointArray);
        } else {
          this.handler.drawingHandler.polygon.addPoint(event);
        }
      } else if (this.handler.interactionMode === "line") {
        if (this.handler.pointArray.length && this.handler.activeLine) {
          this.handler.drawingHandler.line.generate(event);
        } else {
          this.handler.drawingHandler.line.addPoint(event);
        }
      } else if (this.handler.interactionMode === "arrow") {
        if (this.handler.pointArray.length && this.handler.activeLine) {
          this.handler.drawingHandler.arrow.generate(event);
        } else {
          this.handler.drawingHandler.arrow.addPoint(event);
        }
      }
    }
  };

  /**
   *
   * @param {FabricEvent<MouseEvent>} opt
   */
  mousemove = (opt) => {
    const event = opt;
    if (this.handler.interactionMode === "grab" && this.panning) {
      this.handler.interactionHandler.moving(event.e);
      this.handler.canvas.requestRenderAll();
    }
    if (!this.handler.editable && event.target) {
      if (event.target.superType === "element") {
        return;
      }
      if (event.target.id !== "workarea") {
        if (event.target !== this.handler.target) {
          this.handler.tooltipHandler.show(event.target);
        }
      } else {
        this.handler.tooltipHandler.hide(event.target);
      }
    }
    if (this.handler.interactionMode === FABRIC_POLYGON_ELEMENT) {
      if (this.handler.activeLine && this.handler.activeLine.class === "line") {
        const pointer = this.handler.canvas.getPointer(event.e);
        this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
        const points = this.handler.activeShape.get("points");
        points[this.handler.pointArray.length] = {
          x: pointer.x,
          y: pointer.y,
        };
        this.handler.activeShape.set({
          points,
        });
        this.handler.canvas.requestRenderAll();
      }
    } else if (this.handler.interactionMode === "line") {
      if (this.handler.activeLine && this.handler.activeLine.class === "line") {
        const pointer = this.handler.canvas.getPointer(event.e);
        this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
      }
      this.handler.canvas.requestRenderAll();
    } else if (this.handler.interactionMode === "arrow") {
      if (this.handler.activeLine && this.handler.activeLine.class === "line") {
        const pointer = this.handler.canvas.getPointer(event.e);
        this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
      }
      this.handler.canvas.requestRenderAll();
    } else if (this.handler.interactionMode === "link") {
      if (this.handler.activeLine && this.handler.activeLine.class === "line") {
        const pointer = this.handler.canvas.getPointer(event.e);
        this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
      }
      this.handler.canvas.requestRenderAll();
    }
    return;
  };

  /**
   * Mouse up event on canvas
   *
   * @param {FabricEvent<MouseEvent>} opt
   * @returns
   */
  mouseup = (opt) => {
    const event = opt;

    if (this.handler.interactionMode === "grab") {
      this.panning = false;
      return;
    }
    const { target, e } = event;
    if (this.handler.interactionMode === "selection") {
      if (target && e.shiftKey && target.superType === "node") {
        const node = target;
        this.handler.canvas.discardActiveObject();
        const nodes = [];
        this.handler.nodeHandler.getNodePath(node, nodes);
        const activeSelection = new fabric.ActiveSelection(nodes, {
          canvas: this.handler.canvas,
          ...this.handler.activeSelectionOption,
        });
        this.handler.canvas.setActiveObject(activeSelection);
        this.handler.canvas.requestRenderAll();
      }
    }
    if (this.handler.editable && this.handler.guidelineOption.enabled) {
      this.handler.guidelineHandler.verticalLines.length = 0;
      this.handler.guidelineHandler.horizontalLines.length = 0;
    }

    if (!this.handler.canvas.getActiveObject()) {
      // If nothing is selected then it's outside click
      this.handler.onActiveLayer(target);
    }

    this.handler.canvas.requestRenderAll();
  };

  /**
   * Mouse out event on canvas
   *
   * @param {FabricEvent<MouseEvent>} opt
   */
  mouseout = (opt) => {
    const event = opt;
    if (!event.target) {
      this.handler.tooltipHandler.hide();
    }
  };

  /**
   * Modified event object
   *
   * @param {FabricEvent} opt
   * @returns
   */
  modified = (opt) => {
    const { target, message } = opt;
    if (!target) {
      return;
    }
    if (
      (target.type === FABRIC_CIRCLE_ELEMENT && target.parentId) ||
      target?.custtype === "maskImage"
    ) {
      return;
    }

    // If active selection is modified, we will calculate new positions
    if (target.type === ACTIVE_SELECTION) {
      this.handler.updatePositions(target);
      return;
    }

    const { onModified } = this.handler;
    if (onModified) {
      onModified(target, message);
    }
  };

  textChanged = (opt) => {
    const { target, message } = opt;
    if (!target) {
      return;
    }

    if (target.type === FABRIC_CIRCLE_ELEMENT && target.parentId) {
      // TODO(Sushant): Why need this condition? - Akshay
      return;
    }

    if (
      target.type === FABRIC_PHOTOTEXT_ELEMENT &&
      typeof target.fill === "object" &&
      target.fill?.type === "pattern"
    ) {
      var recalculatePhotoTextFillPattern = debounce(() => {
        target.loadPhotoTextPatternImage(target?.fill?.src, {
          offsetX: target?.fill?.offsetX,
          offsetY: target?.fill?.offsetY,
        });
      }, 500);

      recalculatePhotoTextFillPattern();
    }

    const { onTextFormatingChange } = this.handler;
    if (onTextFormatingChange) {
      onTextFormatingChange(target, message);
    }
  };

  textSelectionChanged = (opt) => {
    const { target } = opt;
    if (!target) {
      return;
    }
    if (target.type === FABRIC_CIRCLE_ELEMENT && target.parentId) {
      return;
    }

    const { onTextSelectionChange, textHandler } = this.handler;
    if (onTextSelectionChange) {
      let selectionStyle = textHandler.getStyle(
        target.toJSON(this.handler.propertiesToInclude)
      );
      onTextSelectionChange(target, selectionStyle);
    }
  };

  /**
   * Scaling event object
   *
   * @param {FabricEvent} opt
   */
  scaling = (opt) => {
    const { target } = opt;

    if (this.handler.interactionMode === CROP_INTERACTION) {
      // this.handler.cropHandler.resize(opt);
    }

    // TODO...this.handler.guidelineHandler.scalingGuidelines(target);
    if (target.superType === "element") {
      const { id, width, height } = target;
      const el = this.handler.elementHandler.findById(id);
      // update the element
      this.handler.elementHandler.setScaleOrAngle(el, target);
      this.handler.elementHandler.setSize(el, target);
      this.handler.elementHandler.setPosition(el, target);
      const video = target;
      if (video.type === "video" && video.player) {
        video.player.setPlayerSize(width, height);
      }
    }

    if (
      target &&
      target.type === FABRIC_IMAGE_ELEMENT &&
      this.handler.interactionMode !== CROP_INTERACTION
    ) {
      target.oldScaleX = target.scaleX;
      target.oldScaleY = target.scaleY;
      target.setCoords();
    }
  };

  /**
   * Scaled event object
   *
   * @param {FabricEvent} opt
   */
  scaled = (opt) => {
    const { target } = opt;

    if (
      target.type === FABRIC_PHOTOTEXT_ELEMENT &&
      typeof target.fill === "object" &&
      target.fill?.type === "pattern"
    ) {
      let controlPoint = target.__corner;

      if (controlPoint && (controlPoint === "mr" || controlPoint === "ml")) {
        target.loadPhotoTextPatternImage(target?.fill?.src, {
          offsetX: target?.fill?.offsetX,
          offsetY: target?.fill?.offsetY,
        });
      }
    }

    if (
      target.type === FABRIC_TEXTBOX_ELEMENT ||
      target.type === FABRIC_ITEXT_ELEMENT
    ) {
      let controlPoint = target.__corner;

      if (
        controlPoint &&
        !(controlPoint === "mb" || controlPoint === "mt") &&
        target.scaleX === target.scaleY
      ) {
        let styles = target.styles || {};

        // TODO: Check if we can optimize this nested iteration
        forOwn(styles, (values, key) => {
          forOwn(values, (value, key) => {
            if (value?.fontSize) {
              value.fontSize *= target.scaleX;
            }
          });
        });

        target.set({
          height: target.height * target.scaleY,
          width: target.width * target.scaleX,
          scaleY: 1,
          scaleX: 1,
          fontSize: target.fontSize * target.scaleX,
          styles,
        });

        target._clearCache();
      }
    }

    // if (!this.handler.transactionHandler.active) {
    //   this.handler.transactionHandler.save("scaled");
    // }
  };

  /**
   * Rotating event object
   *
   * @param {FabricEvent} opt
   */
  rotating = (opt) => {
    const { target } = opt;
    if (target.superType === "element") {
      const { id } = target;
      const el = this.handler.elementHandler.findById(id);
      // update the element
      this.handler.elementHandler.setScaleOrAngle(el, target);
    }
  };

  /**
   * Rotated event object
   *
   * @param {FabricEvent} opt
   */
  rotated = (_opt) => {
    if (!this.handler.transactionHandler.active) {
      this.handler.transactionHandler.save("rotated");
    }
  };

  /**
   * Moved event object
   *
   * @param {FabricEvent} opt
   */
  moved = (opt) => {
    const { target } = opt;
    // this.handler.gridHandler.setCoords(target);
    if (!this.handler.transactionHandler.active) {
      this.handler.transactionHandler.save("moved");
    }
    if (target.superType === "element") {
      const { id } = target;
      const el = this.handler.elementHandler.findById(id);
      this.handler.elementHandler.setPosition(el, target);
    }
  };

  /**
   * Zoom at mouse wheel event
   *
   * @param {FabricEvent<WheelEvent>} opt
   * @returns
   */
  mousewheel = (opt) => {
    const event = opt;
    const { zoomEnabled } = this.handler;
    if (!zoomEnabled) {
      return;
    }
    const delta = event.e.deltaY;
    let zoomRatio = this.handler.canvas.getZoom();
    if (delta > 0) {
      zoomRatio -= 0.05;
    } else {
      zoomRatio += 0.05;
    }

    this.handler.zoomHandler.zoomToPoint(
      // To zoom in, zoom out from centre of canvas
      new fabric.Point(
        this.handler.canvas.getWidth() / 2,
        this.handler.canvas.getHeight() / 2
      ),
      // To zoom in, zoom out from mouse point
      //new fabric.Point(event.e.offsetX, event.e.offsetY),
      zoomRatio
    );
    event.e.preventDefault();
    event.e.stopPropagation();
  };

  /**
   * Moving event object
   *
   * @param {FabricEvent} opt
   * @returns
   */
  moving = (opt) => {
    const { target } = opt;
    if (this.handler.interactionMode === CROP_INTERACTION) {
      // this.handler.cropHandler.moving(opt);
    } else {
      if (this.handler.editable && this.handler.guidelineOption.enabled) {
        this.handler.guidelineHandler.movingGuidelines(target);
      }
      if (target.type === "activeSelection") {
        const activeSelection = target;
        activeSelection.getObjects().forEach((obj) => {
          const left = target.left + obj.left + target.width / 2;
          const top = target.top + obj.top + target.height / 2;
          if (obj.superType === "node") {
            this.handler.portHandler.setCoords({ ...obj, left, top });
          } else if (obj.superType === "element") {
            const { id } = obj;
            const el = this.handler.elementHandler.findById(id);
            // TODO... Element object incorrect position
            this.handler.elementHandler.setPositionByOrigin(el, obj, left, top);
          }
        });
        return;
      }
      if (target.superType === "node") {
        this.handler.portHandler.setCoords(target);
      } else if (target.superType === "element") {
        const { id } = target;
        const el = this.handler.elementHandler.findById(id);
        this.handler.elementHandler.setPosition(el, target);
      }
    }
  };

  resize = (nextWidth, nextHeight) => {
    this.handler.canvas.setWidth(nextWidth).setHeight(nextHeight);
    this.handler.canvas.setBackgroundColor(
      this.handler.canvasOption.backgroundColor,
      this.handler.canvas.renderAll.bind(this.handler.canvas)
    );

    if (!this.handler.workarea) {
      return;
    }
    const diffWidth = nextWidth / 2 - this.handler.width / 2;
    const diffHeight = nextHeight / 2 - this.handler.height / 2;
    this.handler.width = nextWidth;
    this.handler.height = nextHeight;
    if (this.handler.workarea.layout === WORKAREA_LAYOUT_FIXED) {
      this.handler.canvas.centerObject(this.handler.workarea);
      this.handler.workarea.setCoords();
      if (this.handler.gridOption.enabled) {
        return;
      }
      this.handler.canvas.getObjects().forEach((obj) => {
        if (obj.id !== "workarea") {
          const left = obj.left + diffWidth;
          const top = obj.top + diffHeight;
          obj.set({
            left,
            top,
          });
          obj.setCoords();
          if (obj.superType === "element") {
            const { id } = obj;
            const el = this.handler.elementHandler.findById(id);
            // update the element
            this.handler.elementHandler.setPosition(el, obj);
          }
        }
      });
      this.handler.canvas.requestRenderAll();
      return;
    }
    if (this.handler.workarea.layout === WORKAREA_LAYOUT_RESPONSIVE) {
      const { scaleX } = this.handler.workareaHandler.calculateScale();
      const center = this.handler.canvas.getCenter();
      const deltaPoint = new fabric.Point(diffWidth, diffHeight);
      this.handler.canvas.relativePan(deltaPoint);
      // To keep padding in workarea instead of sticking to border
      const zoomPercentage = scaleX > 0.1 ? scaleX - 0.1 : scaleX;
      this.handler.zoomHandler.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomPercentage
      );
      return;
    }
    const scaleX = nextWidth / this.handler.workarea.width;
    const scaleY = nextHeight / this.handler.workarea.height;
    const diffScaleX =
      nextWidth / (this.handler.workarea.width * this.handler.workarea.scaleX);
    const diffScaleY =
      nextHeight /
      (this.handler.workarea.height * this.handler.workarea.scaleY);
    this.handler.workarea.set({
      scaleX,
      scaleY,
    });
    this.handler.canvas.getObjects().forEach((obj) => {
      const { id } = obj;
      if (obj.id !== "workarea") {
        const left = obj.left * diffScaleX;
        const top = obj.top * diffScaleY;
        const newScaleX = obj.scaleX * diffScaleX;
        const newScaleY = obj.scaleY * diffScaleY;
        obj.set({
          scaleX: newScaleX,
          scaleY: newScaleY,
          left,
          top,
        });
        obj.setCoords();
        if (obj.superType === "element") {
          const video = obj;
          const { width, height } = obj;
          const el = this.handler.elementHandler.findById(id);
          this.handler.elementHandler.setSize(el, obj);
          if (video.player) {
            video.player.setPlayerSize(width, height);
          }
          this.handler.elementHandler.setPosition(el, obj);
        }
      }
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Context menu event on canvas
   *
   * @param {MouseEvent} e
   */
  contextmenu = (e) => {
    e.preventDefault();
    const { editable, onContext } = this.handler;
    if (editable && onContext) {
      const target = this.handler.canvas.findTarget(e, false);
      if (target && target.type !== "activeSelection") {
        this.handler.select(target);
      }
      this.handler.contextmenuHandler.show(e, target);
    }
  };

  /**
   * Mouse down event on canvas
   *
   * @param {MouseEvent} _e
   */
  onmousedown = (_e) => {
    this.handler.contextmenuHandler.hide();
  };

  /**
   * Paste event on canvas
   *
   * @param {ClipboardEvent} e
   * @returns
   */
  paste = (e) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    const { onCopyPaste } = this.handler;
    const clipboardData = e.clipboardData;
    if (clipboardData.types.length) {
      clipboardData.types.forEach((clipboardType) => {
        switch (clipboardType) {
          case "text/plain":
            const textPlain = clipboardData.getData("text/plain");
            var isInternalElementCopied = false;

            if (this.validateID(textPlain)) {
              isInternalElementCopied = true;
            } else if (
              isURL(textPlain) &&
              endsWithAny(PASTED_URL_SUFFIXES, textPlain)
            ) {
              isInternalElementCopied = false;
            }

            try {
              if (onCopyPaste) {
                onCopyPaste("paste", textPlain, isInternalElementCopied);
              }
            } catch (error) {
              console.error(error);
            }
            break;
          case "text/html":
            const textHtml = clipboardData.getData("text/html");
            break;
          case "Files":
            var updatedFiles = [];
            Array.from(clipboardData.files).forEach((file) => {
              var blob = file.slice(0, file.size, file.type);
              var updatedFile = new File(
                [blob],
                `${file.name}_${file.lastModified}`,
                { type: file.type }
              );
              updatedFiles.push(updatedFile);
            });
            if (onCopyPaste) {
              onCopyPaste("paste", updatedFiles, false);
            }
            break;
          default:
            return;
        }
      });
    }
    return true;
  };

  validateID = (text) => {
    var re = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    return re.test(text);
  };

  /**
   * Keydown event on document
   *
   * @param {KeyboardEvent} e
   */
  keydown = (e) => {
    const {
      editable,
      onRemove,
      onCopyPaste,
      onToggleGlobalSearch,
      onSelectTopOrBottomLayer,
      onUndoRedo,
      toGroup,
      toActiveSelection,
      onToggleSidebarPanel,
      onClone,
      onExportAsJPEG,
    } = this.handler;
    const activeObject = this.handler.canvas.getActiveObject();
    if (!activeObject && !editable) {
      return;
    }
    // enable grab mode on key press
    if (e.keyCode === 32 && editable) {
      if (this.handler.cropHandler.cropRect) {
        this.handler.cropHandler.cancel(false);
      }
      if (this.handler.clipHandler.clipRect) {
        this.handler.clipHandler.cancel(false);
      }

      this.handler.interactionHandler.grab();
      return;
    }
    if (editable) {
      switch (true) {
        case this.handler.shortcutHandler.isDelete(e):
          if (onRemove) {
            onRemove(activeObject);
          }
          break;
        case this.handler.shortcutHandler.isCtrlC(e):
          e.preventDefault();
          if (onCopyPaste) {
            onCopyPaste("copy");
          }
          break;
        case this.handler.shortcutHandler.isCtrlZ(e):
          e.preventDefault();
          if (onUndoRedo) {
            onUndoRedo("undo");
          }
          break;
        case this.handler.shortcutHandler.isCtrlY(e):
          e.preventDefault();
          if (onUndoRedo) {
            onUndoRedo("redo");
          }
          break;
        case this.handler.shortcutHandler.isPlus(e):
          e.preventDefault();
          this.handler.zoomHandler.zoomIn();
          break;
        case this.handler.shortcutHandler.isMinus(e):
          e.preventDefault();
          this.handler.zoomHandler.zoomOut();
          break;
        case this.handler.shortcutHandler.isO(e):
          e.preventDefault();
          this.handler.zoomHandler.zoomOneToOne();
          break;
        case this.handler.shortcutHandler.isP(e):
          e.preventDefault();
          this.handler.zoomHandler.zoomToFit();
          break;
        case this.handler.shortcutHandler.isCtrlK(e):
          e.preventDefault();
          if (onToggleGlobalSearch) {
            onToggleGlobalSearch();
          }
          break;
        case this.handler.shortcutHandler.isCtrlD(e):
          e.preventDefault();
          if (onClone) {
            onClone();
          }
          break;
        case this.handler.shortcutHandler.isCtrlShiftG(e):
          e.preventDefault();
          if (toActiveSelection) {
            toActiveSelection();
          }
          break;
        case this.handler.shortcutHandler.isCtrlG(e):
          e.preventDefault();
          if (toGroup) {
            toGroup();
          }
          break;
        case this.handler.shortcutHandler.isCtrlShiftE(e):
          e.preventDefault();
          if (onExportAsJPEG) {
            onExportAsJPEG();
          }
          break;
        case this.handler.shortcutHandler.isAltPeriod(e):
          e.preventDefault();
          if (onSelectTopOrBottomLayer) {
            onSelectTopOrBottomLayer("top");
          }
          break;
        case this.handler.shortcutHandler.isAltComma(e):
          e.preventDefault();
          if (onSelectTopOrBottomLayer) {
            onSelectTopOrBottomLayer("bottom");
          }
          break;
        case this.handler.shortcutHandler.isCtrlB(e):
          e.preventDefault();
          if (FABRIC_TEXT_TYPES.includes(activeObject?.type)) {
            const currentFontWeight = activeObject.fontWeight;
            const fontWeight =
              currentFontWeight >= FONT_BOLD_WEIGHT
                ? FONT_REGULAR_WEIGHT
                : FONT_BOLD_WEIGHT;
            this.handler.textHandler.bold(fontWeight);
          }
          break;
        case this.handler.shortcutHandler.isI(e):
          if (onToggleSidebarPanel) {
            onToggleSidebarPanel(IMAGES_SLIDER_PANEL);
          }
          break;
        case this.handler.shortcutHandler.isCtrlI(e):
          e.preventDefault();
          if (FABRIC_TEXT_TYPES.includes(activeObject?.type)) {
            const currentFontStyle = activeObject.fontStyle;
            const fontStyle =
              currentFontStyle === "italic" ? "normal" : "italic";
            this.handler.textHandler.italic(fontStyle);
          }
          break;
        case this.handler.shortcutHandler.isCtrlU(e):
          e.preventDefault();
          if (FABRIC_TEXT_TYPES.includes(activeObject?.type)) {
            const currentUnderline = activeObject.underline;
            this.handler.textHandler.underline(!currentUnderline);
          }
          break;
        case this.handler.shortcutHandler.isCtrlShiftX(e):
          e.preventDefault();
          if (FABRIC_TEXT_TYPES.includes(activeObject?.type)) {
            const currentLinethrough = activeObject.linethrough;
            this.handler.textHandler.strike(!currentLinethrough);
          }
          break;
        case this.handler.shortcutHandler.isCtrlShiftL(e):
          e.preventDefault();
          if (!activeObject || activeObject.type === "activeSelection") {
            return;
          }

          if (activeObject.selectable) {
            this.handler.lockLayer();
          }
          break;
        case this.handler.shortcutHandler.isArrow(e):
          this.arrowmoving(e);
          break;
        case this.handler.shortcutHandler.isC(e):
          e.preventDefault();
          if (onToggleSidebarPanel) {
            onToggleSidebarPanel(ELEMENTS_SLIDER_PANEL);
          }
          break;
        case this.handler.shortcutHandler.isV(e):
          if (e.ctrlKey || e.metaKey) {
            return;
          }
          e.preventDefault();
          if (onToggleSidebarPanel) {
            onToggleSidebarPanel(ICONS_SLIDER_PANEL);
          }
          break;
        case this.handler.shortcutHandler.isT(e):
          if (onToggleSidebarPanel) {
            onToggleSidebarPanel(TEXT_SLIDER_PANEL);
          }
          break;
        case this.handler.shortcutHandler.isM(e):
          if (onToggleSidebarPanel) {
            onToggleSidebarPanel(VIDEO_SLIDER_PANEL);
          }
          break;
        case this.handler.shortcutHandler.isCtrlForwardSlash(e):
          if (onToggleSidebarPanel) {
            onToggleSidebarPanel();
          }
          break;
        default:
          return;
      }
      return;
    }
    return;
  };

  /**
   * Key up event on canvas
   *
   * @param {KeyboardEvent} _e
   */
  keyup = (e) => {
    if (this.handler.interactionHandler.isDrawingMode()) {
      return;
    }

    switch (true) {
      case e.keyCode === 32:
        this.handler.interactionHandler.selection();
        break;
      case this.handler.shortcutHandler.isArrow(e):
        const activeObject = this.handler.canvas.getActiveObject();
        if (!activeObject) {
          return;
        }

        this.handler.canvas.fire("object:modified", { target: activeObject });
        break;
      default:
        return;
    }
  };

  arrowmoving = (e) => {
    const activeObject = this.handler.canvas.getActiveObject();
    let offset = 1;
    if (e.shiftKey) {
      offset *= 10;
    } else if (e.ctrlKey) {
      offset *= 100;
    }

    switch (e.keyCode) {
      // arrow up
      case 38:
        if (!activeObject || activeObject.id === "workarea") {
          return false;
        }
        activeObject.set("top", activeObject.top - offset);
        activeObject.setCoords();
        this.handler.canvas.renderAll();
        return true;
      // arrow down
      case 40:
        if (!activeObject || activeObject.id === "workarea") {
          return false;
        }
        activeObject.set("top", activeObject.top + offset);
        activeObject.setCoords();
        this.handler.canvas.renderAll();
        return true;
      // arrow left
      case 37:
        if (activeObject) {
          activeObject.set("left", activeObject.left - offset);
          activeObject.setCoords();
          this.handler.canvas.renderAll();
        } else if (!activeObject || activeObject.id === "workarea") {
          this.handler.onArtboardSelectionChanged("prev");
        }
        return true;
      // arrow right
      case 39:
        if (activeObject) {
          activeObject.set("left", activeObject.left + offset);
          activeObject.setCoords();
          this.handler.canvas.renderAll();
        } else if (!activeObject || activeObject.id === "workarea") {
          this.handler.onArtboardSelectionChanged("next");
        }
        return true;
      default:
        break;
    }
    return true;
  };

  objectRenderFinish = (event) => {
    const { target } = event;
    // If object is part of group
    if (target?.group) {
      const fGroupObj = target.group;
      fGroupObj.addWithUpdate();
      this.handler.canvas.renderAll();
    }
  };
}
