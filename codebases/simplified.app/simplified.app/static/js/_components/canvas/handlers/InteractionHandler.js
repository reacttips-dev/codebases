import { fabric } from "fabric";

/**
 * This class handles all the interactions on the canvas
 */
class InteractionHandler {
  constructor(handler) {
    this.handler = handler;

    if (this.handler.editable) {
      this.selection();
    }
  }

  /**
   * Enable selection mode, default mode
   * @param {callback} callback
   */
  selection = (callback) => {
    if (this.handler.interactionMode === "selection") {
      return;
    }
    this.handler.interactionMode = "selection";
    if (typeof this.handler.canvasOption.selection === "undefined") {
      this.handler.canvas.selection = true;
    } else {
      this.handler.canvas.selection = this.handler.canvasOption.selection;
    }
    this.handler.canvas.defaultCursor = "default";
    this.handler.workarea.hoverCursor = "default";
    this.handler.getObjects().forEach((obj) => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        // When typeof selection is ActiveSelection, ignoring selectable, because link position left: 0, top: 0
        if (obj.superType === "link" || obj.superType === "port") {
          obj.selectable = false;
          obj.evented = true;
          obj.hoverCursor = "pointer";
          return;
        }
        obj.hoverCursor = "move";
        obj.selectable = true;
        obj.evented = true;
      }
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Enable grab mode
   * @param {callback} callback
   */
  grab = (callback) => {
    if (this.handler.interactionMode === "grab") {
      return;
    }
    this.handler.interactionMode = "grab";
    this.handler.canvas.selection = false;
    this.handler.canvas.defaultCursor = "grab";
    this.handler.workarea.hoverCursor = "grab";
    this.handler.getObjects().forEach((obj) => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        obj.selectable = false;
        obj.evented = this.handler.editable ? false : true;
      }
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Enable preview mode
   * @param {callback} callback
   */
  preview = (callback) => {
    if (this.handler.interactionMode === "preview") {
      return;
    }
    this.handler.interactionMode = "preview";
    this.handler.canvas.selection = false;
    this.handler.canvas.defaultCursor = "wait";
    this.handler.workarea.hoverCursor = "wait";
    this.handler.getObjects().forEach((obj) => {
      if (callback) {
        this.interactionCallback(obj, callback);
      } else {
        obj.selectable = false;
        obj.evented = this.handler.editable ? false : true;
      }
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Whether is drawing mode
   * @returns
   */
  isDrawingMode = () => {
    return (
      this.handler.interactionMode === "link" ||
      this.handler.interactionMode === "arrow" ||
      this.handler.interactionMode === "line" ||
      this.handler.interactionMode === "polygon"
    );
  };

  isPreviewMode = () => {
    return this.handler.interactionMode === "preview";
  };

  /**
   * Moving objects in grap mode
   * @param {FabricEvent<MouseEvent>} e
   */
  moving = (e) => {
    if (this.isDrawingMode() || this.isPreviewMode()) {
      return;
    }
    const delta = new fabric.Point(e.movementX, e.movementY);
    this.handler.canvas.relativePan(delta);
    this.handler.canvas.requestRenderAll();
    this.handler.objects.forEach((obj) => {
      if (obj.superType === "element") {
        const { id } = obj;
        const el = this.handler.elementHandler.findById(id);
        // update the element
        this.handler.elementHandler.setPosition(el, obj);
      }
    });
  };
}

export default InteractionHandler;
