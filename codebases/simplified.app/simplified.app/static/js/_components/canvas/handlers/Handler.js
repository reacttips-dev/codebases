import SuperHandler from "./SuperHandler";
import EventHandler from "./EventHandler";
import ZoomHandler from "./ZoomHandler";
import CropHandler from "./CropHandler";
import GuidelineHandler from "./GuidelineHandler";
import TransactionHandler from "./TransactionHandler";
import ObjectHandler from "./ObjectHandler";
import ContextmenuHandler from "./ContextmenuHandler";
import InteractionHandler from "./InteractionHandler";
import ShortcutHandler from "./ShortcutHandler";
import {
  defaultGridOption,
  defaultPropertiesToExclude,
  defaultPropertiesToInclude,
} from "../constants/defaults";
import { union } from "lodash";

export default class Handler extends SuperHandler {
  constructor(options) {
    super(options);
    this.handlerName = "Handler";
    this.initialize(options);
  }

  initialize = (options) => {
    this.initOption(options);
    this.initCallback(options);
    this.initHandler();
  };

  initOption = (options) => {
    this.editable = options.editable;
    this.interactionMode = options.interactionMode;
    this.minZoom = options.minZoom;
    this.maxZoom = options.maxZoom;
    this.zoomEnabled = options.zoomEnabled;
    this.objectToCrop = null;

    this.setPropertiesToInclude(options.propertiesToInclude);
    this.setPropertiesToExclude(options.propertiesToExclude);
    this.setGridOption(options.gridOption);
    this.setObjectOption(options.objectOption);
    this.setActiveSelectionOption(options.activeSelectionOption);
    this.setGuidelineOption(options.guidelineOption);
    this.setKeyEvent(options.keyEvent);
  };

  initCallback = (options) => {
    this.onAdd = options.onAdd;
    this.onTooltip = options.onTooltip;
    this.onZoom = options.onZoom;
    this.onChange = options.onChange;
    this.onContext = options.onContext;
    this.onClick = options.onClick;
    this.onModified = options.onModified;
    this.onDblClick = options.onDblClick;
    this.onSelect = options.onSelect;
    this.onRemove = options.onRemove;
    this.onTransaction = options.onTransaction;
    this.onInteraction = options.onInteraction;
    this.onLoad = options.onLoad;
    this.onActiveLayer = options.onActiveLayer;
    this.onTextFormatingChange = options.onTextFormatingChange;
    this.onTextSelectionChange = options.onTextSelectionChange;
    this.onVideoPlayingStatusChange = options.onVideoPlayingStatusChange;
    this.onCopyPaste = options.onCopyPaste;
    this.onToggleGlobalSearch = options.onToggleGlobalSearch;
    this.onSelectTopOrBottomLayer = options.onSelectTopOrBottomLayer;
    this.onUndoRedo = options.onUndoRedo;
    this.onGroupUngroup = options.onGroupUngroup;
    this.onToggleSidebarPanel = options.onToggleSidebarPanel;
    this.onClone = options.onClone;
    this.onExportAsJPEG = options.onExportAsJPEG;
    this.onArtboardSelectionChanged = options.onArtboardSelectionChanged;
  };

  initHandler = () => {
    this.eventHandler = new EventHandler(this);
    this.zoomHandler = new ZoomHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.guidelineHandler = new GuidelineHandler(this);
    this.transactionHandler = new TransactionHandler(this);
    this.objectHandler = new ObjectHandler(this);
    this.cropHandler = new CropHandler(this);
    this.contextmenuHandler = new ContextmenuHandler(this);
    this.shortcutHandler = new ShortcutHandler(this);
  };

  /**
   * Set propertiesToInclude
   *
   * @param {string[]} propertiesToInclude
   */
  setPropertiesToInclude = (propertiesToInclude) => {
    this.propertiesToInclude = union(
      propertiesToInclude,
      this.propertiesToInclude,
      defaultPropertiesToInclude
    );
  };

  /**
   * Set setPropertiesToExclude
   *
   * @param {string[]} propertiesToExclude
   */
  setPropertiesToExclude = (propertiesToExclude) => {
    this.propertiesToExclude = union(
      propertiesToExclude,
      this.propertiesToExclude,
      defaultPropertiesToExclude
    );
  };

  /**
   * Set grid option
   *
   * @param {GridOption} gridOption
   */
  setGridOption = (gridOption) => {
    this.gridOption = Object.assign({}, defaultGridOption, gridOption);
  };

  /**
   * Set guideline option
   *
   * @param {GuidelineOption} guidelineOption
   */
  setGuidelineOption = (guidelineOption) => {
    this.guidelineOption = Object.assign(
      {},
      this.guidelineOption,
      guidelineOption
    );
    if (this.guidelineHandler) {
      this.guidelineHandler.initialize();
    }
  };

  /**
   * Set object option
   *
   * @param {FabricObjectOption} objectOption
   */
  setObjectOption = (objectOption) => {
    this.objectOption = Object.assign({}, this.objectOption, objectOption);
  };

  /**
   * Set activeSelection option
   *
   * @param {Partial<FabricObjectOption<fabric.ActiveSelection>>} activeSelectionOption
   */
  setActiveSelectionOption = (activeSelectionOption) => {
    this.activeSelectionOption = Object.assign(
      {},
      this.activeSelectionOption,
      activeSelectionOption
    );
  };

  /**
   * Set keyboard event
   *
   * @param {KeyEvent} keyEvent
   */
  setKeyEvent = (keyEvent) => {
    this.keyEvent = Object.assign({}, this.keyEvent, keyEvent);
  };

  /**
   * Select object
   * @param {FabricObjectID} objectId
   * @param {boolean} [find]
   */
  searchAndSelect = (objectId) => {
    let findObject = this.findById(objectId);
    if (findObject) {
      this.canvas.discardActiveObject();
      this.canvas.setActiveObject(findObject);
      this.canvas.requestRenderAll();
    }
  };

  /**
   * Select object
   * @param {FabricObject} obj
   * @param {boolean} [find]
   */
  select = (obj, find) => {
    let findObject = obj;
    if (find) {
      findObject = this.find(obj);
    }
    if (findObject) {
      this.canvas.discardActiveObject();
      this.canvas.setActiveObject(findObject);
      this.canvas.requestRenderAll();
    }
  };

  unselectActiveObject = () => {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) {
      return;
    }
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  };

  /**
   * This method async calculates the new relative positions when user moves the object.
   * @param {*} target
   */
  updatePositions = async (target) => {
    const layersUpdated = [];
    const { left, top } = this.workarea;

    let include = this.propertiesToInclude;
    let exclude = this.propertiesToExclude;
    const lastUpdatedTimeStamp = Date.now();
    target.clone((newgroup) => {
      newgroup._restoreObjectsState();
      newgroup._objects.forEach((objectInGroup, index) => {
        let objectPayload = objectInGroup.toJSON(include, exclude);
        objectPayload["left"] -= left;
        objectPayload["top"] -= top;
        objectPayload["lastUpdated"] = lastUpdatedTimeStamp;
        objectInGroup.lastUpdated = lastUpdatedTimeStamp;
        target._objects[index].lastUpdated = lastUpdatedTimeStamp;

        var message = {
          layer: objectInGroup.id,
          content: {},
          payload: objectPayload,
        };
        layersUpdated.push(message);
      });
      this.onModified(target, layersUpdated);
      return "success";
    }, this.propertiesToInclude);
  };

  unlockThisLayer = (layerId) => {
    let findObject = this.findById(layerId);
    if (findObject) {
      this.objectHandler.unlock(findObject);
    }
  };

  lockLayer = () => {
    this.objectHandler.lock();
  };

  move = (action) => {
    if (action === "move_forward") {
      this.bringForward();
    } else if (action === "move_to_front") {
      this.bringToFront();
    } else if (action === "move_backward") {
      this.sendBackwards();
    } else if (action === "move_to_back") {
      this.sendToBack();
    }
  };

  /**
   * Bring forward
   */
  bringForward = () => {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.bringForward(activeObject);
    }
  };

  /**
   * Bring to front
   */
  bringToFront = () => {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.bringToFront(activeObject);
      // const { onModified } = this;
      // if (onModified) {
      // 	onModified(activeObject);
      // }
    }
  };

  /**
   * Send backwards
   * @returns
   */
  sendBackwards = () => {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      const firstObject = this.canvas.getObjects()[1];
      if (firstObject.id === activeObject.id) {
        return;
      }
      this.canvas.sendBackwards(activeObject);
      // const { onModified } = this;
      // if (onModified) {
      // 	onModified(activeObject);
      // }
    }
  };

  /**
   * Send to back
   */
  sendToBack = () => {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.sendToBack(activeObject);
      this.canvas.bringForward(activeObject); // As last object is always workarea, due to it it require to bring forward.
      // const { onModified } = this;
      // if (onModified) {
      // 	onModified(activeObject);
      // }
    }
  };

  add(obj, centered = true, loaded = false) {
    const { editable, onAdd, gridOption, objectOption } = this;

    let createdObj = super.add(obj, centered, loaded);
    if (!createdObj) return;

    if (!editable && !(obj.superType === "element")) {
      createdObj.on("mousedown", this.eventHandler.object.mousedown);
    }
    if (createdObj.dblclick) {
      createdObj.on("mousedblclick", this.eventHandler.object.mousedblclick);
    }

    if (createdObj.superType === "node") {
      this.portHandler.create(createdObj);
      if (createdObj.iconButton) {
        this.canvas.add(createdObj.iconButton);
      }
    }

    if (gridOption?.enabled) {
      this.gridHandler.setCoords(createdObj);
    }

    if (onAdd && this.sendUpdate) {
      onAdd(createdObj);
    }

    createdObj = this.applyActiveSelectionOption(createdObj);

    return createdObj;
  }

  remove(target, callback = false) {
    super.remove(target, callback);
    const activeObject = target || this.canvas.getActiveObject();
    const { onRemove } = this;
    if (onRemove && callback) {
      onRemove(activeObject);
    }
  }

  applyActiveSelectionOption = (canvasObj) => {
    for (const [key, value] of Object.entries(this.activeSelectionOption)) {
      // console.log(`${key}: ${value}`);
      canvasObj[key] = value;
    }
    return canvasObj;
  };
}
