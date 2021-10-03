import WorkareaHandler from "./WorkareaHandler";
import TextHandler from "./TextHandler";
import ImageHandler from "./ImageHandler";
import ElementHandler from "./ElementHandler";
import AnimationHandler from "./AnimationHandler";
import FontHandler from "./FontHandler";
import AudioHandler from "./AudioHandler";
import {
  defaultCanvasOption,
  defaultWorkareaOption,
} from "../constants/defaults";
import {
  FABRIC_GIF_ELEMENT,
  FABRIC_GROUP_ELEMENT,
  FABRIC_IMAGE_ELEMENT,
  FABRIC_PHOTOTEXT_ELEMENT,
  FABRIC_SVG_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
  FABRIC_TEXT_TYPES,
  FABRIC_VIDEO_ELEMENT,
} from "../../details/constants";
import { fabric } from "fabric";
import Video from "../objects/Video";
import VideoEventHandler from "./VideoEventHandler";
import { v4 } from "uuid";
import { UNGROUP, GROUP } from "../../../_actions/types";
import * as Sentry from "@sentry/react";
import ClipHandler from "./ClipHandler";
import MaskHandler from "./MaskHandler";

export default class SuperHandler {
  constructor(options) {
    this.handlerName = "SuperHandler";
    this.initialize(options);
  }

  initialize = (options) => {
    this.initOption(options);
    this.initCallback(options);
    this.initHandler();
  };

  initOption = (options) => {
    this.id = options.id;
    this.canvas = options.canvas;
    this.container = options.container;
    this.width = options.width;
    this.height = options.height;
    this.objects = [];

    this.isRequsetAnimFrame = false;
    this.setWorkareaOption(options.workareaOption);
    this.setCanvasOption(options.canvasOption);
    this.setFabricObjects(options.fabricObjects);
  };

  initCallback = (options) => {
    // Do nothing
  };

  initHandler = () => {
    this.workareaHandler = new WorkareaHandler(this);
    this.textHandler = new TextHandler(this);
    this.imageHandler = new ImageHandler(this);
    this.elementHandler = new ElementHandler(this);
    this.animationHandler = new AnimationHandler(this);
    this.fontHandler = new FontHandler(this);
    this.audioHandler = new AudioHandler(this);
    this.clipHandler = new ClipHandler(this);
    this.maskHandler = new MaskHandler(this);
  };

  /**
   * Set workarea option
   *
   * @param {WorkareaOption} workareaOption
   */
  setWorkareaOption = (workareaOption) => {
    this.workareaOption = Object.assign(
      {},
      defaultWorkareaOption,
      workareaOption
    );
    if (this.workarea) {
      this.workarea.set({
        ...workareaOption,
      });
    }
  };

  setCanvasOption = (canvasOption) => {
    this.canvasOption = Object.assign({}, defaultCanvasOption, canvasOption);
    this.canvas.setBackgroundColor(
      canvasOption.backgroundColor,
      this.canvas.renderAll.bind(this.canvas)
    );
    if (
      typeof canvasOption.width !== "undefined" &&
      typeof canvasOption.height !== "undefined"
    ) {
      if (this.eventHandler) {
        this.eventHandler.resize(canvasOption.width, canvasOption.height);
      } else {
        this.canvas.setWidth(canvasOption.width).setHeight(canvasOption.height);
      }
    }
    if (typeof canvasOption.selection !== "undefined") {
      this.canvas.selection = canvasOption.selection;
    }
    if (typeof canvasOption.hoverCursor !== "undefined") {
      this.canvas.hoverCursor = canvasOption.hoverCursor;
    }
    if (typeof canvasOption.defaultCursor !== "undefined") {
      this.canvas.defaultCursor = canvasOption.defaultCursor;
    }
    if (typeof canvasOption.preserveObjectStacking !== "undefined") {
      this.canvas.preserveObjectStacking = canvasOption.preserveObjectStacking;
    }
  };

  /**
   * Set fabric objects
   *
   * @param {FabricObjects} fabricObjects
   */
  setFabricObjects = (fabricObjects) => {
    this.fabricObjects = Object.assign({}, this.fabricObjects, fabricObjects);
  };

  /**
   * Get primary object
   * @returns {FabricObject[]}
   */
  getObjects = () => {
    const objects = this.canvas.getObjects().filter((obj) => {
      if (obj.id === "workarea") {
        return false;
      } else if (obj.id === "grid") {
        return false;
      } else if (obj.superType === "port") {
        return false;
      } else if (!obj.id) {
        return false;
      } else if (obj.id === "addText") {
        return false;
      }
      return true;
    });
    if (objects.length) {
      objects.forEach((obj) => (this.objectMap[obj.id] = obj));
    } else {
      this.objectMap = {};
    }
    return objects;
  };

  /**
   * Find object by object
   * @param {FabricObject} obj
   */
  find = (obj) => this.findById(obj.id);

  /**
   * Find object by id
   * @param {string} id
   * @returns {(FabricObject | null)}
   */
  findById = (id) => {
    let findObject;
    const exist = this.objects.some((obj) => {
      if (obj.id === id) {
        findObject = obj;
        return true;
      }
      return false;
    });
    if (!exist) {
      console.warn("Not found object by id.");
      return null;
    }
    return findObject;
  };

  add(obj, centered = true, loaded = false) {
    const { editable, objectOption } = this;
    let sendUpdate = editable && !loaded; // layer is editable and not synced completely;
    const option = {
      hasControls: editable,
      hasBorders: editable,
      selectable: editable,
      lockMovementX: !editable,
      lockMovementY: !editable,
      hoverCursor: !editable ? "pointer" : "move",
      editable: editable,
    };
    if (editable && this.workarea.layout === "fullscreen") {
      option.scaleX = this.workarea.scaleX;
      option.scaleY = this.workarea.scaleY;
    }
    const newOption = Object.assign(
      {},
      objectOption,
      {
        container: this.container.id,
        editable,
      },
      option,
      obj
    );
    // Individually create canvas object
    if (obj.superType === "link") {
      return this.linkHandler.create(newOption, loaded);
    }
    let createdObj;
    // Create canvas object
    if (obj.type === FABRIC_IMAGE_ELEMENT) {
      sendUpdate = false;
      createdObj = this.addImage({ ...newOption, loaded });
      if (createdObj.getElement()) {
        createdObj.getElement().onload = () => {
          this.canvas.requestRenderAll();
        };
      }
    } else if (obj.type === FABRIC_VIDEO_ELEMENT) {
      createdObj = this.addVideo({ ...newOption, loaded });
    } else if (obj.type === FABRIC_SVG_ELEMENT) {
      sendUpdate = false;
      createdObj = this.fabricObjects[obj.type].create({
        ...newOption,
        loaded,
        onLoaded: this.onSVGLoaded,
      });
    } else if (obj.type === FABRIC_GROUP_ELEMENT) {
      // Group add function needs to be fixed
      loaded = true;
      const objects = this.addGroup(newOption, centered, loaded);
      if (!objects) {
        console.error("failed to render group");
        return;
      }
      const groupOption = Object.assign({}, newOption, {
        objects,
        name: "New Group",
        subTargetCheck: true,
      });
      createdObj = this.fabricObjects[obj.type].create(groupOption);
      objects.forEach((obj, index) => this.remove(obj));
    } else if (obj.type === FABRIC_TEXTBOX_ELEMENT) {
      createdObj = this.fabricObjects[obj.type].create(newOption);
      while (createdObj.height > createdObj.maxHeight) {
        // Temp fixed this issue.
        createdObj.set({ fontSize: createdObj.fontSize - 1 });
        createdObj.height = createdObj.maxHeight - 1;
        sendUpdate = true;
      }
      // We need update styles for all
      if (sendUpdate) {
        this.textHandler.addorUpdateStylesToObject(createdObj, {
          fontSize: createdObj.fontSize,
        });
      }
    } else if (obj.type === FABRIC_PHOTOTEXT_ELEMENT) {
      sendUpdate = false;
      createdObj = this.fabricObjects[obj.type]?.create({
        ...newOption,
        loaded,
        onLoaded: this.onPhotoTextLoaded,
      });
    } else {
      createdObj = this.fabricObjects[obj.type]?.create(newOption);
      if (!createdObj) {
        return;
      }
      this.canvas.fire("object:render:finished", { target: createdObj });
    }
    if (obj.clipPath) {
      const clipPath = this.clipHandler.getFClipPath(obj);
      createdObj.set({
        clipPath: clipPath,
      });
    }

    // Omitting image and text elements
    if (
      !loaded &&
      obj.type !== FABRIC_IMAGE_ELEMENT &&
      !FABRIC_TEXT_TYPES.includes(obj.type)
    ) {
      createdObj = this.fitObjectToWorkareaCenter(createdObj);
    }
    this.canvas.add(createdObj);

    this.objects = this.getObjects();

    if (this.objects.some((object) => object.type === FABRIC_GIF_ELEMENT)) {
      this.startRequestAnimFrame();
    } else {
      this.stopRequestAnimFrame();
    }
    // TODO: Review
    if (
      (obj.superType !== "drawing" &&
        obj.superType !== "link" &&
        editable &&
        !loaded) ||
      centered
    ) {
      this.centerObject(createdObj, centered);
    }
    // if (createdObj.superType === "node") {
    //   this.portHandler.create(createdObj);
    //   if (createdObj.iconButton) {
    //     this.canvas.add(createdObj.iconButton);
    //   }
    // }
    if (!editable && createdObj.animation && createdObj.animation.autoplay) {
      this.animationHandler.play(createdObj.id);
    }
    if (createdObj.superType === "node") {
      createdObj.setShadow({
        color: createdObj.stroke,
      });
    }
    this.sendUpdate = sendUpdate;
    return createdObj;
  }

  /**
   * Set key pair
   * @param {keyof FabricObject} key
   * @param {*} value
   * @returns
   */
  set = (key, value) => {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) {
      return;
    }
    activeObject.set(key, value);
    activeObject.setCoords();
    this.canvas.requestRenderAll();
    const { id, superType, type, player, width, height } = activeObject;
    if (superType === "element") {
      if (key === "visible") {
        if (value) {
          activeObject.element.style.display = "block";
        } else {
          activeObject.element.style.display = "none";
        }
      }
      const el = this.elementHandler.findById(id);
      // update the element
      this.elementHandler.setScaleOrAngle(el, activeObject);
      this.elementHandler.setSize(el, activeObject);
      this.elementHandler.setPosition(el, activeObject);
      this.elementHandler.setFilter(el, activeObject);
      if (type === "video" && player) {
        player.setPlayerSize(width, height);
      }
    }
    const { onModified } = this;
    if (onModified) {
      onModified(activeObject);
    }
  };

  /**
   * Add group object
   *
   * @param {FabricGroup} obj
   * @param {boolean} [centered=true]
   * @param {boolean} [loaded=false]
   * @returns
   */
  addGroup = (obj, centered = true, loaded = false) => {
    if (obj?.objects?.length > 0) {
      return obj.objects.map((child) => {
        return this.add(child, centered, loaded);
      });
    }
  };

  /**
   * Add iamge object
   * @param {FabricImage} obj
   * @returns
   */
  addImage = (obj) => {
    const { objectOption } = this;
    const { filters = [], loaded = false, ...otherOption } = obj;
    // let imageOption = Object.assign({}, objectOption, otherOption, {
    //   originX: "left",
    //   originY: "top",
    // });
    const image = new Image();

    let imageOption = Object.assign({}, objectOption, otherOption, {
      originX: "left",
      originY: "top",
    });

    const createdObj = new fabric.Image(image, imageOption);

    createdObj.set({
      filters: this.imageHandler.createFilters(filters),
    });

    this.setImage(createdObj, obj.src || obj.file, loaded);

    return createdObj;
  };

  addVideo = (obj) => {
    const { objectOption } = this;
    const { filters = [], loaded, ...otherOption } = obj;

    let videoOption = Object.assign({}, objectOption, otherOption, {
      originX: "left",
      originY: "top",
    });

    let createdObj = new Video(obj.src, videoOption);

    createdObj.set({
      filters: this.imageHandler.createFilters(filters),
    });

    if (createdObj.getElement()) {
      new VideoEventHandler(createdObj, this);
    }

    this.canvas.fire("object:render:finished", { target: obj });
    return createdObj;
  };

  onSVGLoaded = (obj, loaded) => {
    if (!loaded) {
      this.fitObjectToWorkareaCenter(obj);
    }
    obj.setCoords();
    this.canvas.requestRenderAll();
    this.canvas.fire("object:render:finished", { target: obj });
    if (!loaded) {
      this.onAdd(obj);
    }
  };

  onPhotoTextLoaded = (obj, loaded) => {
    obj.setCoords();
    this.canvas.requestRenderAll();
    this.canvas.fire("object:render:finished", { target: obj });
    if (!loaded) {
      this.onAdd(obj);
    }
  };

  fitObjectToWorkareaCenter = (obj) => {
    let { width, height } = obj;

    let destinationObject = fabric.util.object.clone(this.workarea);
    // 30% of orignal size
    destinationObject.width *= 0.7;
    destinationObject.height *= 0.7;

    let newScale = fabric.util.findScaleToFit(obj, destinationObject);
    obj.set({
      scaleX: newScale,
      scaleY: newScale,
      width,
      height,
      oldWidth: width,
      oldHeight: height,
      oldScaleX: newScale,
      oldScaleY: newScale,
    });

    this.canvas.viewportCenterObject(obj);
    obj.setCoords();
    this.canvas.renderAll();

    return obj;
  };
  /**
   * Set the image
   * @param {FabricImage} obj
   * @param {(File | string)} [source]
   * @returns
   */
  setImage = (obj, source, loaded = true, isReplacement = false) => {
    if (!source) {
      this.loadImage(obj, null, loaded, isReplacement);
      obj.set("file", null);
      obj.set("src", null);
      return;
    }
    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        this.loadImage(obj, reader.result, loaded, isReplacement);
        obj.set("file", source);
        obj.set("src", null);
      };
      reader.readAsDataURL(source);
    } else {
      this.loadImage(obj, source, loaded, isReplacement);
      obj.set("file", null);
      obj.set("src", source);
    }
  };

  /**
   * Remove object
   * @param {FabricObject} target
   * @returns {any}
   */
  remove(target, callback = false) {
    const activeObject = target || this.canvas.getActiveObject();
    if (this.prevTarget && this.prevTarget.superType === "link") {
      this.linkHandler.remove(this.prevTarget);
      return;
    }
    if (!activeObject) {
      return;
    }
    if (
      typeof activeObject.deletable !== "undefined" &&
      !activeObject.deletable
    ) {
      return;
    }
    if (activeObject.type !== "activeSelection") {
      if (this.canvas.interactive) {
        this.canvas.discardActiveObject();
      }
      if (activeObject.superType === "element") {
        this.elementHandler.removeById(activeObject.id);
      }
      if (activeObject.superType === "link") {
        this.linkHandler.remove(activeObject);
      } else if (activeObject.superType === "node") {
        if (activeObject.toPort) {
          if (activeObject.toPort.links.length) {
            activeObject.toPort.links.forEach((link) => {
              this.linkHandler.remove(link, "from");
            });
          }
          this.canvas.remove(activeObject.toPort);
        }
        if (activeObject.fromPort && activeObject.fromPort.length) {
          activeObject.fromPort.forEach((port) => {
            if (port.links.length) {
              port.links.forEach((link) => {
                this.linkHandler.remove(link, "to");
              });
            }
            this.canvas.remove(port);
          });
        }
      } else if (activeObject.type === FABRIC_GROUP_ELEMENT) {
        activeObject._objects.forEach((children) => {
          this.remove(children, false);
        });
      }
      this.canvas.remove(activeObject);
    } else {
      const { _objects: activeObjects } = activeObject;
      const existDeleted = activeObjects.some(
        (obj) => typeof obj.deletable !== "undefined" && !obj.deletable
      );
      if (existDeleted) {
        return;
      }
      if (this.canvas.interactive) {
        this.canvas.discardActiveObject();
      }
      activeObjects.forEach((obj) => {
        if (obj.superType === "element") {
          this.elementHandler.removeById(obj.id);
        } else if (obj.superType === "node") {
          if (obj.toPort) {
            if (obj.toPort.links.length) {
              obj.toPort.links.forEach((link) => {
                this.linkHandler.remove(link, "from");
              });
            }
            this.canvas.remove(obj.toPort);
          }
          if (obj.fromPort && obj.fromPort.length) {
            obj.fromPort.forEach((port) => {
              if (port.links.length) {
                port.links.forEach((link) => {
                  this.linkHandler.remove(link, "to");
                });
              }
              this.canvas.remove(port);
            });
          }
        }
        this.canvas.remove(obj);
      });
    }
    this.objects = this.getObjects();
  }

  /**
   * Remove object by id
   * @param {string} id
   */
  removeById = (id) => {
    const findObject = this.findById(id);
    if (findObject) {
      this.remove(findObject);
    }
  };

  /**
   * Delete at origin object list
   * @param {string} id
   */
  removeOriginById = (id) => {
    const object = this.findOriginByIdWithIndex(id);
    if (object.index > 0) {
      this.objects.splice(object.index, 1);
    }
  };

  setObject = (objectId, key, value) => {
    const object = this.findById(objectId);

    if (!object) {
      return;
    }
    object.set(key, value);
    object.setCoords();
    this.canvas.requestRenderAll();
    const { id, superType, type, player, width, height } = object;
    if (superType === "element") {
      if (key === "visible") {
        if (value) {
          object.element.style.display = "block";
        } else {
          object.element.style.display = "none";
        }
      }
      const el = this.elementHandler.findById(id);
      // update the element
      this.elementHandler.setScaleOrAngle(el, object);
      this.elementHandler.setSize(el, object);
      this.elementHandler.setPosition(el, object);
      this.elementHandler.setFilter(el, object);
      if (type === "video" && player) {
        player.setPlayerSize(width, height);
      }
    }
    const { onModified } = this;

    if (onModified) {
      onModified(object);
    }
  };

  /**
   * RemoveKey
   * @param {*} key
   */
  removeKey = (key) => {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) {
      return;
    }
    delete activeObject[key];
    this.canvas.requestRenderAll();
    const { onModified } = this;
    if (onModified) {
      onModified(activeObject);
    }
  };

  /**
   * Duplicate object
   * @returns
   */
  duplicate = (layerIds) => {
    const {
      onAdd,
      propertiesToInclude,
      gridOption: { grid = 10 },
    } = this;
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) {
      return;
    }
    if (
      typeof activeObject.cloneable !== "undefined" &&
      !activeObject.cloneable
    ) {
      return;
    }
    activeObject.clone((clonedObj) => {
      if (this.canvas.interactive) {
        this.canvas.discardActiveObject();
      }
      clonedObj.set({
        left: clonedObj.left + grid,
        top: clonedObj.top + grid,
        evented: true,
      });
      if (clonedObj.type === "activeSelection") {
        const activeSelection = clonedObj;
        activeSelection.canvas = this.canvas;
        activeSelection.forEachObject((obj) => {
          obj.set("id", v4());
          this.canvas.add(obj);
          this.objects = this.getObjects();
          if (obj.dblclick) {
            obj.on("mousedblclick", this.eventHandler.object.mousedblclick);
          }
        });
        if (onAdd) {
          onAdd(activeSelection);
        }
        activeSelection.setCoords();
      } else {
        if (activeObject.id === clonedObj.id) {
          clonedObj.set("id", layerIds[activeObject.id]);
        }
        this.applyActiveSelectionOption(clonedObj);
        this.canvas.add(clonedObj);
        this.objects = this.getObjects();
        if (clonedObj.dblclick) {
          clonedObj.on("mousedblclick", this.eventHandler.object.mousedblclick);
        }
        if (onAdd) {
          onAdd(clonedObj);
        }
      }
      this.canvas.setActiveObject(clonedObj);
      // this.portHandler.create(clonedObj);
      this.canvas.requestRenderAll();
    }, propertiesToInclude);
  };

  /**
   * Duplicate object by id
   * @param {string} id
   * @returns
   */
  duplicateById = (id) => {
    const {
      onAdd,
      propertiesToInclude,
      gridOption: { grid = 10 },
    } = this;
    const findObject = this.findById(id);
    if (findObject) {
      if (
        typeof findObject.cloneable !== "undefined" &&
        !findObject.cloneable
      ) {
        return false;
      }
      findObject.clone((cloned) => {
        cloned.set({
          left: cloned.left + grid,
          top: cloned.top + grid,
          id: v4(),
          evented: true,
        });
        this.canvas.add(cloned);
        this.objects = this.getObjects();
        if (onAdd) {
          onAdd(cloned);
        }
        if (cloned.dblclick) {
          cloned.on("mousedblclick", this.eventHandler.object.mousedblclick);
        }
        this.canvas.setActiveObject(cloned);
        // this.portHandler.create(cloned);
        this.canvas.requestRenderAll();
      }, propertiesToInclude);
    }
    return true;
  };

  /**
   * Set the position on Object
   *
   * @param {FabricObject} obj
   * @param {boolean} [centered]
   */
  centerObject = (obj, centered) => {
    if (centered) {
      this.canvas.viewportCenterObject(obj);
      obj.setCoords();
    } else {
      this.setByPartial(obj, {
        left:
          obj.left / this.canvas.getZoom() -
          obj.width / 2 -
          this.canvas.viewportTransform[4] / this.canvas.getZoom(),
        top:
          obj.top / this.canvas.getZoom() -
          obj.height / 2 -
          this.canvas.viewportTransform[5] / this.canvas.getZoom(),
      });
    }
  };

  /**
   * Set partial by object
   * @param {FabricObject} obj
   * @param {FabricObjectOption} option
   * @returns
   */
  setByPartial = (obj, option) => {
    if (!obj) {
      return;
    }
    obj.set(option);
    obj.setCoords();
    this.canvas.renderAll();
    const { id, superType, type, player, width, height } = obj;
    if (superType === "element") {
      if ("visible" in option) {
        if (option.visible) {
          obj.element.style.display = "block";
        } else {
          obj.element.style.display = "none";
        }
      }
      const el = this.elementHandler.findById(id);
      // update the element
      this.elementHandler.setScaleOrAngle(el, obj);
      this.elementHandler.setSize(el, obj);
      this.elementHandler.setPosition(el, obj);
      if (type === "video" && player) {
        player.setPlayerSize(width, height);
      }
    }
  };

  /**
   * Load the image
   * @param {FabricImage} obj
   * @param {string} src
   */
  loadImage = (obj, src, loaded, isReplacement) => {
    let url = src;
    if (!url) {
      return;
    }
    this.loadTldrImage(
      url,
      (imageElement, isError) => {
        if (isError) {
          console.error(`Error to load: ${url}`);
          return;
        }

        if (!imageElement) {
          console.error(
            `HTMLImageElement isn't get loaded properly. ${imageElement}`
          );
          return;
        }

        if (obj.type !== "image") {
          obj.setPatternFill(
            {
              imageElement,
              repeat: "repeat",
            },
            null
          );
          obj.setCoords();
          this.canvas.renderAll();
          return;
        }

        const availableObj = Object.assign({}, obj);

        // Set native image element to fabric object
        // It might change its property
        obj.setElement(imageElement);
        obj.setCoords();
        if (!loaded) {
          this.fitObjectToWorkareaCenter(obj);
        } else if (loaded && (isReplacement || availableObj?.isReplacement)) {
          this.imageObjectReplacement(availableObj, obj);
        } else {
          if (obj.hasCrop()) {
            obj.set({
              width: availableObj?.width,
              height: availableObj?.height,
            });
            obj.setCoords();
          }
        }

        this.canvas.renderAll();
        this.canvas.fire("object:render:finished", { target: obj });
        if (!loaded && this.onAdd) {
          this.onAdd(obj);
        }
      },
      null,
      "anonymous"
    );
  };

  /**
   * Start request animation frame
   */
  startRequestAnimFrame = () => {
    if (!this.isRequsetAnimFrame) {
      this.isRequsetAnimFrame = true;
      const render = () => {
        this.canvas.renderAll();
        this.requestFrame = fabric.util.requestAnimFrame(render);
      };
      fabric.util.requestAnimFrame(render);
    }
  };

  /**
   * Stop request animation frame
   */
  stopRequestAnimFrame = () => {
    this.isRequsetAnimFrame = false;
    const cancelRequestAnimFrame = (() =>
      window.cancelAnimationFrame ||
      // || window.webkitCancelRequestAnimationFrame
      // || window.mozCancelRequestAnimationFrame
      // || window.oCancelRequestAnimationFrame
      // || window.msCancelRequestAnimationFrame
      clearTimeout)();
    cancelRequestAnimFrame(this.requestFrame);
  };

  /**
   * This method async ungroups the objects.
   * @param {*} target
   */
  groupObjects = async (newGroup) => {
    this.objects = this.getObjects();
    const { left, top } = this.workarea;

    let include = this.propertiesToInclude;
    let exclude = this.propertiesToExclude;
    const lastUpdatedTimeStamp = Date.now();

    let objectPayload = newGroup.toJSON(include, exclude);
    objectPayload["left"] -= left;
    objectPayload["top"] -= top;
    objectPayload["lastUpdated"] = lastUpdatedTimeStamp;
    newGroup.lastUpdated = lastUpdatedTimeStamp;
    this.onGroupUngroup(GROUP, newGroup.id, objectPayload);
  };

  /**
   * Active selection to group
   * @returns
   */
  toGroup = (target) => {
    const activeObject = target || this.canvas.getActiveObject();
    if (!activeObject) {
      return null;
    }
    if (activeObject.type !== "activeSelection") {
      return null;
    }

    var objects = activeObject._objects,
      canvas = this.canvas;
    var options = activeObject.toObject(this.propertiesToInclude);
    delete options.objects;
    var newGroup = new fabric.Group([]);
    delete options.type;
    newGroup.set({
      id: v4(),
      ...options,
      ...this.activeSelectionOption,
    });

    canvas.remove(activeObject);
    objects.forEach(function (object) {
      object.group = newGroup;
    });
    newGroup.canvas = canvas;
    newGroup._objects = objects;
    canvas._activeObject = newGroup;
    canvas.add(newGroup);
    newGroup.setCoords();
    canvas.renderAll();
    this.groupObjects(newGroup);
    return newGroup;
  };

  resize = (scale) => {
    let allLayers = this.getObjects();
    if (allLayers.length > 0) {
      var sel = new fabric.ActiveSelection(allLayers, {
        canvas: this.canvas,
      });
      sel.scaleX = scale;
      sel.scaleY = scale;
      this.canvas.centerObject(sel);
      this.canvas.requestRenderAll();
    }
  };

  /**
   * This method async ungroups the objects.
   * @param {*} target
   */
  unGroupObjects = async (groupId, activeSelection) => {
    const layersUpdated = [];
    const { left, top } = this.workarea;

    let include = this.propertiesToInclude;
    let exclude = this.propertiesToExclude;
    const lastUpdatedTimeStamp = Date.now();

    await activeSelection.clone((newgroup) => {
      newgroup._restoreObjectsState();
      newgroup._objects.forEach((objectInGroup, index) => {
        let objectPayload = objectInGroup.toJSON(include, exclude);
        objectPayload["left"] -= left;
        objectPayload["top"] -= top;
        objectPayload["lastUpdated"] = lastUpdatedTimeStamp;
        objectInGroup.lastUpdated = lastUpdatedTimeStamp;
        activeSelection._objects[index].lastUpdated = lastUpdatedTimeStamp;

        var message = {
          layer: objectInGroup.id,
          content: {},
          payload: objectPayload,
        };
        layersUpdated.push(message);
      });
      this.onGroupUngroup(UNGROUP, groupId, layersUpdated);
      return "success";
    }, this.propertiesToInclude);
  };

  /**
   * Group to active selection
   * @returns
   */
  toActiveSelection = (target) => {
    const activeObject = target || this.canvas.getActiveObject();
    if (!activeObject) {
      return null;
    }
    if (activeObject.type !== "group") {
      return;
    }
    var objects = activeObject._objects,
      canvas = this.canvas;
    var options = activeObject.toObject(this.propertiesToInclude);
    delete options.objects;
    var activeSelection = new fabric.ActiveSelection([]);
    activeSelection.set({
      ...options,
      ...this.activeSelectionOption,
      type: activeSelection,
    });
    canvas.remove(activeObject);
    objects.forEach(function (object) {
      object.group = activeSelection;
      canvas.add(object);
    });
    this.objects = this.getObjects();
    activeSelection.canvas = canvas;
    activeSelection._objects = objects;
    canvas._activeObject = activeSelection;
    activeSelection.setCoords();
    this.unGroupObjects(activeObject.id, activeSelection);
    return activeSelection;
  };

  /**
   * Create active selection
   * @returns
   */
  createActiveSelection = (activeSelection) => {
    if (activeSelection.length > 1) {
      var sel = new fabric.ActiveSelection(activeSelection, {
        canvas: this.canvas,
      });
      this.canvas.setActiveObject(sel);
    } else if (activeSelection.length === 1) {
      this.canvas.setActiveObject(activeSelection[0]);
    }
    this.canvas.requestRenderAll();
  };

  /**
   * Save and export image
   * @param {*} targetObject
   * @param {*} option
   */
  saveImage = (
    targetObject,
    option = { name: "layer", format: "png", quality: 1 }
  ) => {
    let dataUrl;
    let target = targetObject || this.canvas.getActiveObject();
    if (target) {
      dataUrl = target.toDataURL(option);
    }

    if (dataUrl) {
      const anchorEl = document.createElement("a");
      anchorEl.href = dataUrl;
      anchorEl.download = `${option.name}.png`;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
    }
  };

  /**
   * Save target object as image
   * @param {FabricObject} targetObject
   * @param {string} [option={ name: 'New Image', format: 'png', quality: 1 }]
   */
  getObjectImageDataUrl = (
    targetObject,
    option = { name: "New Image", format: "png", quality: 1 }
  ) => {
    let dataUrl;
    let target = targetObject || this.canvas.getActiveObject();
    if (target) {
      dataUrl = target.toDataURL(option);
    }
    return dataUrl;
  };

  /**
   * Save canvas as image
   * @param {string} [option={ name: 'New Image', format: 'png', quality: 1 }]
   */
  saveCanvasImage = (
    option = { name: "New Image", format: "png", quality: 1 }
  ) => {
    const dataUrl = this.canvas.toDataURL(option);
    if (dataUrl) {
      const anchorEl = document.createElement("a");
      anchorEl.href = dataUrl;
      anchorEl.download = `${option.name}.png`;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
    }
  };

  getArtBoardAsDataURL = (options) => {
    const { left, top, width, height, scaleX, scaleY } = this.workarea;

    let artBoardWidth = width * scaleX;
    let artBoardHeight = height * scaleY;

    // To ignore zoom ratio
    this.canvas.imageSmoothingEnabled = false;
    var originalTransform = this.canvas.viewportTransform;
    this.canvas.viewportTransform = fabric.iMatrix.slice(0);

    let dataURL = this.canvasToDataURL({
      ...options,
      left,
      top,
      width: artBoardWidth,
      height: artBoardHeight,
    });

    this.canvas.imageSmoothingEnabled = true;
    this.canvas.viewportTransform = originalTransform;

    return dataURL;
  };

  saveDataURLToFile = (dataURL, option) => {
    if (dataURL) {
      const anchorEl = document.createElement("a");
      anchorEl.href = dataURL;
      anchorEl.download = `${option.name}.${option.format}`;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
    } else {
      console.error(
        "There is an error while exporting artboard as image. Contact to support center."
      );
    }
  };

  getObjectIndexById = (objId) => {
    let objects = this.canvas.getObjects();

    let objectIndex = null;
    objects.forEach((object, index) => {
      if (object.id === objId) {
        objectIndex = index;
      }
    });

    return objectIndex;
  };

  /**
   * Copy to clipboard
   *
   * @param {*} value
   */
  copyToClipboard = (value) => {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = value;
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    this.canvas.wrapperEl.focus();
  };

  /**
   * Convert object to json
   * @param {*} fbObject
   */
  toJson = (fbObject) => {
    if (fbObject) {
      const { left, top } = this.workarea;
      const lastUpdatedTimeStamp = Date.now();
      let include = this.propertiesToInclude;
      let exclude = this.propertiesToExclude;
      let objectPayload = fbObject.toJSON(include, exclude);
      objectPayload["lastUpdated"] = lastUpdatedTimeStamp;
      objectPayload["left"] -= left;
      objectPayload["top"] -= top;
      var message = {
        layer: fbObject.id,
        content: {},
        payload: objectPayload,
      };
      return message;
    }
  };

  /**
   * This will return backend ready payload
   */
  getLayersPayload = () => {
    let layersPayload = [];
    const allLayers = this.getObjects();
    allLayers.forEach((layer) => {
      const layerPayload = this.toJson(layer);
      layersPayload.push(layerPayload);
    });
    return layersPayload;
  };

  canvasToDataURL = (options) => {
    let dataUrl;
    try {
      dataUrl = this.canvas.toDataURL(options);
    } catch (error) {
      // If somehow canvas get failed to be download as image
      Sentry.captureException(error);
    }
    return dataUrl;
  };

  /**
   * Import json
   * @param {*} json
   * @param {(canvas: FabricCanvas) => void} [callback]
   */
  importJSON = async (json, callback) => {
    if (!json) {
      return;
    }
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    let prevLeft = 0;
    let prevTop = 0;
    this.canvas.setBackgroundColor(
      this.canvasOption.backgroundColor,
      this.canvas.renderAll.bind(this.canvas)
    );
    const workareaExist = json.filter((obj) => obj.id === "workarea");

    if (!this.workarea) {
      const workarea = workareaExist[0];
      const mergedCanvasWorkAreaOption = Object.assign(
        {},
        this.workareaOption,
        {
          ...workarea,
          width: workarea.width,
          height: workarea.height,
        }
      );
      this.setWorkareaOption(mergedCanvasWorkAreaOption);
      this.workareaHandler.initialize();
    } else {
    }
    if (!workareaExist.length) {
      this.canvas.centerObject(this.workarea);
      this.workarea.setCoords();
      prevLeft = this.workarea.left;
      prevTop = this.workarea.top;
    } else {
      const workarea = workareaExist[0];
      prevLeft = workarea.left;
      prevTop = workarea.top;

      let {
        width: workareaWidth,
        height: workareaHeight,
        top: workareaTop,
        left: workareaLeft,
      } = this.workarea;

      this.canvas.clipPath = new fabric.Rect({
        width: workareaWidth,
        height: workareaHeight,
        top: workareaTop,
        left: workareaLeft,
      });

      this.canvas.renderAll();
    }
    json.forEach((obj) => {
      if (obj.id === "workarea") {
        return;
      }
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();
      const { width, height, scaleX, scaleY, layout, left, top } =
        this.workarea;
      if (layout === "fullscreen") {
        const leftRatio = canvasWidth / (width * scaleX);
        const topRatio = canvasHeight / (height * scaleY);
        obj.left *= leftRatio;
        obj.top *= topRatio;
        obj.scaleX *= leftRatio;
        obj.scaleY *= topRatio;
      } else {
        const diffLeft = left - prevLeft;
        const diffTop = top - prevTop;
        obj.left += diffLeft;
        obj.top += diffTop;
      }
      if (obj.superType === "element") {
        // obj.id = v4();
      }
      let isObjLoaded = true;
      if (!obj?.top || !obj?.left) {
        isObjLoaded = false;
      }
      this.add(obj, false, isObjLoaded);
      this.canvas.requestRenderAll();
    });
    this.objects = this.getObjects();
    if (callback) {
      callback(this.canvas);
    }
    return Promise.resolve(this.canvas);
  };

  /**
   * Loads image element from given url and passes it to a callback
   * @memberOf fabric.util
   * @param {String} url URL representing an image
   * @param {Function} callback Callback; invoked with loaded image
   * @param {*} [context] Context to invoke callback in
   * @param {Object} [crossOrigin] crossOrigin value to set image element to
   */
  loadTldrImage = (url, callback, context, crossOrigin) => {
    if (!url) {
      callback && callback.call(context, url);
      return;
    }

    var img = new Image();
    img.crossOrigin = "Anonymous";
    /** @ignore */
    var onLoadCallback = function () {
      callback && callback.call(context, img, false);
      img = img.onload = img.onerror = null;
    };

    img.onload = onLoadCallback;
    /** @ignore */
    img.onerror = function () {
      fabric.log("Error loading " + img.src);
      callback && callback.call(context, null, true);
      img = img.onload = img.onerror = null;
    };

    // data-urls appear to be buggy with crossOrigin
    // https://github.com/kangax/fabric.js/commit/d0abb90f1cd5c5ef9d2a94d3fb21a22330da3e0a#commitcomment-4513767
    // see https://code.google.com/p/chromium/issues/detail?id=315152
    //     https://bugzilla.mozilla.org/show_bug.cgi?id=935069
    // crossOrigin null is the same as not set.
    if (
      url.indexOf("data") !== 0 &&
      crossOrigin !== undefined &&
      crossOrigin !== null
    ) {
      img.crossOrigin = crossOrigin;
    }

    // IE10 / IE11-Fix: SVG contents from data: URI
    // will only be available if the IMG is present
    // in the DOM (and visible)
    if (url.substring(0, 14) === "data:image/svg") {
      img.onload = null;
      fabric.util.loadImageInDom(img, onLoadCallback);
    }

    // If hostname matches with bucket name then only do proxy
    // try {
    //   const urlObject = new URL(url);
    //   if (urlObject.hostname === process.env.REACT_APP_ASSET_BUCKET) {
    //     var newUrl = `${PROXY_IMAGES}${url}`;
    //     img.src = newUrl;
    //   } else {
    //     img.src = url;
    //   }
    // } catch (error) {
    img.src = url;
    // }
  };

  imageObjectReplacement = (availableObj, requestedObj) => {
    requestedObj.set({
      cropX: 0,
      cropY: 0,
      scaleX: 1,
      scaleY: 1,
    });

    const availableAspectRation = availableObj.width / availableObj.height;

    const availableScaledWidth = availableObj.scaleX * availableObj.width;
    const availableScaledHeight = availableObj.scaleY * availableObj.height;

    const aspectRatio = requestedObj.width / requestedObj.height;

    let scale = 1;
    if (availableAspectRation > aspectRatio) {
      scale = availableScaledWidth / (requestedObj.width * requestedObj.scaleX);
    } else if (availableAspectRation < aspectRatio) {
      scale =
        availableScaledHeight / (requestedObj.height * requestedObj.scaleY);
    } else {
      scale = availableScaledWidth / (requestedObj.width * requestedObj.scaleX);
      // Or
      // scale = availableScaledHeight / (requestedObj.height * requestedObj.scaleY);
    }

    // Scale the object horizontally/vertically
    requestedObj.scale(scale);

    // Calculate crop area
    const cropY = (requestedObj.getScaledHeight() - availableScaledHeight) / 2;
    const cropX = (requestedObj.getScaledWidth() - availableScaledWidth) / 2;

    // oldWidth, oldHeight, oldScaleX, oldScaleY: To maintain crop area
    requestedObj.set({
      cropX: cropX / requestedObj.scaleX,
      cropY: cropY / requestedObj.scaleY,
      width: availableScaledWidth / requestedObj.scaleX,
      height: availableScaledHeight / requestedObj.scaleY,
      oldWidth: requestedObj.width,
      oldHeight: requestedObj.height,
      oldScaleX: requestedObj.scaleX,
      oldScaleY: requestedObj.scaleY,
      isReplacement: false, // Once image get replace it should false
    });
    requestedObj.setCoords();
    // TODO: Its temporary fix for replacement image
    if (availableObj.isReplacement) {
      this.canvas.fire("object:modified", {
        target: requestedObj,
      });
    }
  };

  update = (obj, payload) => {
    if (payload.clipPath) {
      fabric.util.enlivenObjects([payload.clipPath], function (arg1) {
        payload.clipPath = arg1[0];
      });
    }
    if (
      payload.type === FABRIC_IMAGE_ELEMENT &&
      obj.type === FABRIC_IMAGE_ELEMENT &&
      payload.src !== obj.src
    ) {
      obj.setSrc(payload.src, () => {
        obj.set(payload);
        obj.setCoords();
        this.canvas.renderAll();
      });
    } else {
      obj.set(payload);
      obj.setCoords();
      this.canvas.renderAll();
    }
  };
}
