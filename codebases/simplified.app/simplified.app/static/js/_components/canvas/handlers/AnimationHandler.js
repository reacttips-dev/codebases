import anime from "animejs";
import { fabric } from "fabric";
import { isEmpty } from "lodash";
import {
  FLY_IN_TOP,
  FLY_IN_BOTTOM,
  FLY_IN_LEFT,
  FLY_IN_RIGHT,
  FLY_OUT_TOP,
  FLY_OUT_BOTTOM,
  FLY_OUT_LEFT,
  FLY_OUT_RIGHT,
  SHIFT_LEFT,
  SHIFT_RIGHT,
  SHIFT_TOP,
  SHIFT_BOTTOM,
  REVEAL_IN_TOP,
  REVEAL_IN_BOTTOM,
  REVEAL_IN_LEFT,
  REVEAL_IN_RIGHT,
  REVEAL_OUT_TOP,
  REVEAL_OUT_BOTTOM,
  REVEAL_OUT_LEFT,
  REVEAL_OUT_RIGHT,
  BLOCK_REVEAL_IN_TOP,
  BLOCK_REVEAL_IN_BOTTOM,
  BLOCK_REVEAL_IN_LEFT,
  BLOCK_REVEAL_IN_RIGHT,
  BLOCK_REVEAL_OUT_TOP,
  BLOCK_REVEAL_OUT_BOTTOM,
  BLOCK_REVEAL_OUT_LEFT,
  BLOCK_REVEAL_OUT_RIGHT,
  WIPE_IN_TOP,
  WIPE_IN_BOTTOM,
  WIPE_IN_LEFT,
  WIPE_IN_RIGHT,
  WIPE_OUT_TOP,
  WIPE_OUT_BOTTOM,
  WIPE_OUT_LEFT,
  WIPE_OUT_RIGHT,
  PULSE,
  FLICKER,
  ZOOM_IN,
  ZOOM_OUT,
  ZOOM_IN_BOUNCE,
  ZOOM_OUT_BOUNCE,
  FADE_IN,
  FADE_OUT,
  GLITCH,
  DISCO,
  STOMP,
  BREATHE,
  STILL,
  GREAT_THINKER,
  SUNNY_MORNINGS,
  RISING_STRONG_IN,
  RISING_STRONG_OUT,
  MADE_WITH_LOVE,
  BEAUTIFUL_QUESTIONS,
  DOMINO_DREAMS,
  FIND_YOUR_ELEMENT,
  THURSDAY,
  HELLO_GOODBYE,
  COFFEE_MORNINGS,
  A_NEW_PRODUCTION_IN,
  A_NEW_PRODUCTION_OUT,
  SIGNALS_NOISES,
  FABRIC_VIDEO_ELEMENT,
  FABRIC_TEXT_TYPES,
  GROUP_LEVEL_ANIMATIONS,
} from "../../details/constants";
import store from "../../../store";

class AnimationHandler {
  constructor(handler) {
    this.handler = handler;
    this.timeline = null;
    this.animatedObjects = {};
    this.addedAnimateObjects = [];
    this.letterLevelAnimations = [];
  }

  playVideo = (videoObject) => {
    try {
      videoObject.getElement().play();
      // var self = this;
      // fabric.util.requestAnimFrame(function render() {
      //   self.handler.canvas.requestRenderAll();
      //   videoObject.videoTime = videoObject.getElement().currentTime;
      //   fabric.util.requestAnimFrame(render);
      // })
    } catch (error) {
      console.error(`Error while playing video: ${error}`);
    }
  };

  stopVideo = (videoObject) => {
    videoObject.stop();
  };

  pauseVideo = (videoObject) => {
    videoObject.pause();
  };

  getLayerAnimationOptions = (
    obj,
    animations,
    prevIndex,
    previewMode = false,
    artboardDuration,
    isPreset = false
  ) => {
    if (!animations?.length && obj.type !== FABRIC_VIDEO_ELEMENT) {
      // if there is no animation then return
      return;
    }

    let addedCharacterLevelAnimationObjects = [];
    let addedGroupLevelAnimationObjects = [];
    let enterAnimeOptions = [];
    let exitAnimeOptions = [];

    if (animations) {
      if (animations.length === 1 && animations[0].type === "still") {
        const target = {
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity };
        enterAnimeOptions = [
          {
            option: {
              loop: false,
              targets: target,
              opacity: 1,
              duration: animations[0].trans_duration,
              update: (e) => {
                obj.set({
                  opacity: 1,
                });
                this.handler.canvas.requestRenderAll();
              },
            },
            offset: 0,
          },
        ];
      } else if (GROUP_LEVEL_ANIMATIONS.includes(animations[prevIndex]?.type)) {
        if (
          animations[prevIndex].type.includes("zoom") ||
          animations[prevIndex].type === STOMP ||
          animations[prevIndex].type === BREATHE
        ) {
          this.animatedObjects[obj.id] = {
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            originX: "left",
            originY: "top",
            left: obj.left,
            top: obj.top,
            opacity: obj.opacity,
          };
          const radian = (-obj.angle * Math.PI) / 180;
          const cos = Math.cos(radian);
          const sin = Math.sin(radian);
          let run = 0;
          let rise = 0;

          if (FABRIC_TEXT_TYPES.includes(obj.type)) {
            if (obj.angle === 90 || obj.angle === 270) {
              run =
                (Math.abs(obj.aCoords.tr.y - obj.aCoords.tl.y) * obj.scaleX) /
                2;
              rise =
                (Math.abs(obj.aCoords.bl.x - obj.aCoords.tl.x) * obj.scaleY) /
                2;
            } else {
              run =
                (Math.abs(
                  (obj.aCoords.tr.x - obj.aCoords.tl.x) / Math.cos(radian)
                ) *
                  obj.scaleX) /
                2;
              rise =
                (Math.abs(
                  (obj.aCoords.bl.y - obj.aCoords.tl.y) / Math.cos(radian)
                ) *
                  obj.scaleY) /
                2;
            }
          } else {
            if (obj.angle === 90 || obj.angle === 270) {
              run = Math.abs(obj.aCoords.tr.y - obj.aCoords.tl.y) / 2;
              rise = Math.abs(obj.aCoords.bl.x - obj.aCoords.tl.x) / 2;
            } else {
              run =
                Math.abs(
                  (obj.aCoords.tr.x - obj.aCoords.tl.x) / Math.cos(radian)
                ) / 2;
              rise =
                Math.abs(
                  (obj.aCoords.bl.y - obj.aCoords.tl.y) / Math.cos(radian)
                ) / 2;
            }
          }

          obj.set({
            originX: "center",
            originY: "center",
            left: obj.aCoords.tl.x + cos * run + sin * rise,
            top: obj.aCoords.tl.y + cos * rise - sin * run,
          });
          this.handler.canvas.requestRenderAll();
        }

        if (
          animations[prevIndex].type.includes("reveal") ||
          animations[prevIndex].type.includes("block")
        ) {
          addedGroupLevelAnimationObjects =
            this.getGroupLevelAnimationAddedObjects(obj, animations[prevIndex]);
          enterAnimeOptions = this.getGroupCharacterLevelAnimations(
            obj,
            animations[prevIndex],
            addedGroupLevelAnimationObjects
          );
          if (animations[prevIndex].type.includes("reveal")) {
            if (enterAnimeOptions && enterAnimeOptions.length > 0) {
              enterAnimeOptions.forEach((option, index) => {
                if (index === 0 && obj.type === FABRIC_VIDEO_ELEMENT) {
                  const videoOption = {
                    ...option,
                    option: {
                      ...option.option,
                      begin: () => {
                        this.playVideo(obj);
                      },
                    },
                  };
                  this.timeline.add(
                    videoOption.option,
                    videoOption.offset +
                      (previewMode
                        ? 0
                        : animations?.length
                        ? animations[0].start_time
                        : 0)
                  );
                } else {
                  this.timeline.add(
                    option.option,
                    option.offset +
                      (previewMode
                        ? 0
                        : animations?.length
                        ? animations[0].start_time
                        : 0)
                  );
                }
              });
            }
          }
        } else {
          enterAnimeOptions = this.getGroupLevelAnimations(
            obj,
            animations[prevIndex],
            artboardDuration
          );
        }
      } else {
        addedCharacterLevelAnimationObjects =
          this.getCharacterLevelAnimationAddedObjects(
            obj,
            animations[prevIndex]
          );
        enterAnimeOptions = this.getCharacterLevelAnimations(
          obj,
          animations[prevIndex],
          addedCharacterLevelAnimationObjects
        );
      }
    } else if (!animations && obj.type === FABRIC_VIDEO_ELEMENT) {
      let targets = {
        opacity: 1,
      };
      this.animatedObjects[obj.id] = { opacity: 1 };
      const videoPlayOption = {
        loop: false,
        targets,
        opacity: 1,
        duration: artboardDuration * 1000,
        update: (e) => {
          obj.set({
            opacity: targets.opacity,
          });
          this.handler.canvas.requestRenderAll();
        },
      };
      enterAnimeOptions.push({
        option: { ...videoPlayOption },
        offset: 0,
      });
    }
    if (
      enterAnimeOptions &&
      enterAnimeOptions.length > 0 &&
      !animations?.[prevIndex].type.includes("reveal")
    ) {
      enterAnimeOptions.forEach((option, index) => {
        if (index === 0 && obj.type === FABRIC_VIDEO_ELEMENT) {
          const videoOption = {
            ...option,
            option: {
              ...option.option,
              begin: () => {
                this.playVideo(obj);
              },
            },
          };
          this.timeline.add(
            videoOption.option,
            videoOption.offset +
              (previewMode
                ? 0
                : animations?.length
                ? animations[0].start_time
                : 0)
          );
        } else {
          this.timeline.add(
            option.option,
            option.offset +
              (previewMode
                ? 0
                : animations?.length
                ? animations[0].start_time
                : 0)
          );
        }
      });
    }

    if (previewMode) {
      obj.set("anime", animations[prevIndex]);
      obj.set({
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: "pointer",
        opacity: 0,
      });
      return;
    }

    if (animations && animations.length > 1 && animations[1].type === "still") {
      this.timeline.add(
        {
          duration: animations[1].trans_duration,
        },
        animations[1].start_time
      );
    }

    if (
      animations &&
      animations.length === 3 &&
      animations[0].type !== BREATHE
    ) {
      if (
        GROUP_LEVEL_ANIMATIONS.includes(animations[2].type) &&
        GROUP_LEVEL_ANIMATIONS.includes(animations[0].type)
      ) {
        if (
          animations[2].type.includes("reveal") ||
          animations[2].type.includes("block")
        ) {
          exitAnimeOptions = this.getGroupCharacterLevelAnimations(
            obj,
            animations[2],
            addedGroupLevelAnimationObjects
          );
        } else {
          exitAnimeOptions = this.getGroupLevelAnimations(obj, animations[2]);
        }
      } else {
        exitAnimeOptions = this.getCharacterLevelAnimations(
          obj,
          animations[2],
          addedCharacterLevelAnimationObjects
        );
      }

      if (exitAnimeOptions?.length) {
        exitAnimeOptions.forEach((option) => {
          this.timeline.add(
            option.option,
            option.offset + animations[2].start_time
          );
        });
      }
    } else if (
      animations &&
      (animations.length === 2 ||
        (animations.length === 1 &&
          obj.type !== FABRIC_VIDEO_ELEMENT &&
          !isPreset))
    ) {
      const canvas = this.handler.canvas;
      const endTime =
        animations.length === 2
          ? animations[1].end_time
          : animations[0].end_time;
      exitAnimeOptions = [
        {
          option: {
            letterOpacity: 1,
            duration: artboardDuration * 1000 - endTime,
            update: function () {
              obj.set({
                opacity: 0,
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
      if (exitAnimeOptions?.length) {
        exitAnimeOptions.forEach((option) => {
          this.timeline.add(option.option, option.offset + endTime);
        });
      }
    }
    if (animations && animations.length) {
      obj.set("anime", animations[prevIndex]);
    }
    obj.set({
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: "pointer",
      opacity: 0,
    });
  };

  previewAndUpdate = (
    activeObj,
    newAnimations,
    animationIndex = 0,
    update = true
  ) => {
    const { id } = activeObj;
    if (this.timeline) {
      this.timeline.play();
      return;
    }
    const activeObject = this.handler.canvas.getActiveObject();
    let findObject;
    if (activeObject && activeObject.id === id) {
      findObject = activeObject;
    } else {
      findObject = this.handler.findById(id);
    }
    if (!findObject) {
      return;
    }
    this.timeline = anime.timeline({
      autoplay: false,
    });

    this.getLayerAnimationOptions(
      findObject,
      newAnimations,
      animationIndex,
      true
    );

    if (this.timeline) {
      if (!this.timeline.duration) {
        this.timeline = null;
        return;
      }

      this.handler.interactionHandler.preview();
      this.handler.canvas.requestRenderAll();
      this.timeline.play();
      this.timeline.finished.then(() => {
        this.resetAnimation(findObject);
        if (findObject.type === FABRIC_VIDEO_ELEMENT) {
          this.stopVideo(findObject);
        }
        if (update) {
          this.handler.set("animation", newAnimations);
        }
        this.handler.interactionHandler.selection();
      });
    }
  };

  playAll = (activeObj, animations) => {
    if (this.timeline) {
      this.timeline.play();
      return;
    }
    this.timeline = anime.timeline({
      autoplay: false,
    });

    const activeObject = this.handler.canvas.getActiveObject();
    let findObject;
    if (activeObject && activeObject.id === activeObj.id) {
      findObject = activeObject;
    } else {
      findObject = this.handler.findById(activeObj.id);
    }
    if (!findObject) {
      return;
    }

    this.getLayerAnimationOptions(findObject, animations, 0, false);

    if (this.timeline) {
      if (!this.timeline.duration) {
        this.timeline = null;
        return;
      }

      this.handler.interactionHandler.preview();
      this.handler.canvas.requestRenderAll();
      this.timeline.play();
      this.timeline.finished.then(() => {
        if (findObject.type === FABRIC_VIDEO_ELEMENT) {
          this.stopVideo(findObject);
        }
        this.resetAnimation(findObject);
        this.handler.interactionHandler.selection();
      });
    }
  };

  /**
   * This method previews current artboard
   * @returns
   */
  previewCurrentArtboard = (
    artboardDuration,
    callback,
    previewAll = true,
    isPreset = false
  ) => {
    return new Promise((resolve, reject) => {
      const allLayers = this.handler.getObjects();

      if (this.timeline) {
        this.timeline.play();
        allLayers.forEach((findObject) => {
          if (findObject.type === FABRIC_VIDEO_ELEMENT) {
            this.playVideo(findObject);
          }
        });

        if (callback) {
          resolve(callback());
        }
        return;
      }

      this.timeline = anime.timeline({
        autoplay: false,
      });

      allLayers.forEach((findObject) => {
        let animationSet;
        let animations = findObject.animation;
        if (findObject.type === FABRIC_VIDEO_ELEMENT) {
          animationSet =
            animations?.length > 0
              ? [animations[0]]
              : isPreset
              ? [
                  {
                    end_time: 1000,
                    type: "fade_in",
                    start_time: 0,
                    trans_duration: 1000,
                  },
                ]
              : undefined;
        } else {
          if (!animations) {
            return;
          }
          if (previewAll) {
            animationSet = animations;
          } else {
            animationSet = [animations[0]];
          }
        }

        this.getLayerAnimationOptions(
          findObject,
          animationSet,
          0,
          false,
          artboardDuration,
          isPreset
        );
      });

      if (!this.timeline.duration) {
        this.timeline = null;
        if (callback) {
          const updatedLayers = this.handler.getLayersPayload();
          resolve(callback(updatedLayers));
        }
        return;
      }
      this.handler?.interactionHandler?.preview();
      this.handler.canvas.requestRenderAll();

      this.timeline.play();

      this.timeline.finished.then(() => {
        allLayers.forEach((layerObject) => {
          this.resetAnimation(layerObject);
          if (layerObject.type === FABRIC_VIDEO_ELEMENT) {
            this.stopVideo(layerObject);
          }
        });
        this.handler?.interactionHandler?.selection();
        if (callback) {
          resolve(callback());
        }
      });
    });
  };

  seekToPosition = (point, artboardDuration, shouldEagerPlay = true) => {
    const allLayers = this.handler.getObjects();
    if (!this.timeline) {
      this.timeline = anime.timeline({
        autoplay: false,
      });

      allLayers.forEach((findObject) => {
        let animations = findObject.animation;
        if (!animations && findObject.type !== FABRIC_VIDEO_ELEMENT) {
          return;
        }
        let animationSet = animations;
        this.getLayerAnimationOptions(
          findObject,
          animationSet,
          0,
          false,
          artboardDuration
        );
      });
    }

    if (!this.timeline.duration) {
      this.timeline = null;
      return;
    }

    this.handler?.interactionHandler?.preview();
    this.handler.canvas.requestRenderAll();

    if (point) {
      this.timeline.seek(point * 1000);
      if (shouldEagerPlay) {
        if (this.timeline.paused) {
          this.timeline.play();
        }
      } else {
        this.timeline.play();
        setTimeout(() => {
          this.timeline.pause();
        }, 1);
      }

      allLayers.forEach((findObject) => {
        if (findObject.type === FABRIC_VIDEO_ELEMENT) {
          const videoEl = findObject.getElement();
          videoEl.currentTime = point;
          if (shouldEagerPlay) {
            if (videoEl.paused) {
              videoEl.play();
            }
          } else {
            videoEl.pause();
          }
        }
      });
    }
    return;
  };

  /**
   * Pause the animation
   * @param {string} id
   * @returns
   */
  pause = (id) => {
    const animatedObject = this.animatedObjects[id];
    if (!animatedObject) {
      return;
    }
    this.timeline.pause();
  };

  /**
   * Pause all animations
   */
  pauseAll = () => {
    if (!this.timeline) {
      return;
    }
    this.timeline.pause();
    Object.keys(this.animatedObjects).forEach((key) => {
      const findObject = this.handler.findById(key);
      if (!findObject) {
        return;
      }
      if (findObject.type === FABRIC_VIDEO_ELEMENT) {
        this.pauseVideo(findObject.getElement());
      }
    });
  };

  /**
   * Stop the animation
   * @param {string} id
   * @param {boolean} [hasControls=true]
   * @returns
   */
  stop = (id, effect, hasControls = true) => {
    const animatedObject = this.animatedObjects[id];
    if (!animatedObject) {
      return;
    }
    const findObject = this.handler.findById(id);
    if (!findObject) {
      return;
    }
    this.timeline.pause();
    this.resetAnimation(findObject);
  };

  /**
   * Stop all animations
   */
  // TODO: Stop video
  stopAll = () => {
    if (!this.timeline) {
      return;
    }
    this.timeline.pause();
    this.timeline.seek(0);
    Object.keys(this.animatedObjects).forEach((key) => {
      const findObject = this.handler.findById(key);
      if (!findObject) {
        return;
      }
      this.resetAnimation(findObject);
      if (findObject.type === FABRIC_VIDEO_ELEMENT) {
        this.stopVideo(findObject);
      }
    });

    if (this.handler.interactionHandler) {
      this.handler.interactionHandler.selection();
    }
  };

  /**
   * Restart the animation
   * @param {string} id
   * @returns
   */
  restart = (id) => {
    const findObject = this.handler.findById(id);
    if (!findObject) {
      return;
    }
    if (!findObject.anime) {
      return;
    }
    this.stop(id);
    this.play(id, false, "");
  };

  /**
   * Reset animation
   *
   * @param {FabricObject} obj
   * @param {boolean} [hasControls=true]
   * @returns
   */
  resetAnimation = (obj, hasControls = true) => {
    // if (!obj.anime) {
    //   return;
    // }
    // anime.remove(obj);
    if (this.timeline) this.timeline.remove(obj);

    this.letterLevelAnimations.forEach((anim) => anime.remove(anim));
    this.addedAnimateObjects.forEach((obj) => this.handler.canvas.remove(obj));
    this.addedAnimateObjects = [];
    if (obj.editable) {
      this.animatedObjects[obj.id] = {
        ...this.animatedObjects[obj.id],
        hasControls: true,
        hasBorders: true,
        lockMovementX: false,
        lockMovementY: false,
        hoverCursor: hasControls ? "move" : "pointer",
      };
    } else {
      this.animatedObjects[obj.id] = {
        ...this.animatedObjects[obj.id],
        hasControls: true,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: "pointer",
      };
    }
    obj.set("anime", null);
    obj.set(this.animatedObjects[obj.id]);

    this.handler.canvas.renderAll();
    delete this.animatedObjects[obj.id];
    this.timeline = null;
  };

  getGroupCharacterLevelAnimations = (obj, effect, addedObject) => {
    if (!effect) {
      return;
    }
    const {
      delay = 0,
      trans_duration = 1000,
      autoplay = true,
      loop = false,
      type,
      easing = "easeOutQuart",
      direction = "normal",
    } = effect;
    const option = {
      loop,
      duration: trans_duration,
      direction,
      easing,
    };
    let target;
    switch (type) {
      case BLOCK_REVEAL_IN_TOP:
      case BLOCK_REVEAL_OUT_TOP: {
        target = {
          offsetY: 0,
          opacity: obj.opacity,
          clipY: 0,
        };
        this.animatedObjects[obj.id] = {
          top: obj.top,
          clipPath: null,
          opacity: obj.opacity,
        };
        let offsetY;
        let clipY;
        if (effect.type === BLOCK_REVEAL_IN_TOP) {
          offsetY = [-obj.height * obj.scaleY, obj.height * obj.scaleY + 1];
          clipY = [0, obj.height * 1.1];
        } else {
          offsetY = [obj.height * obj.scaleY, -obj.height * obj.scaleY - 1];
          clipY = [obj.height, -obj.height * 0.1];
        }
        Object.assign(option, {
          targets: target,
          offsetY,
          clipY,
          opacity: obj.opacity,
          update: (e) => {
            addedObject.set({
              top: target.offsetY,
              opacity: target.opacity,
            });
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: obj.width,
                height: target.clipY,
                top: -obj.height / 2,
                left: -obj.width / 2,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      }
      case BLOCK_REVEAL_IN_BOTTOM:
      case BLOCK_REVEAL_OUT_BOTTOM: {
        target = {
          offsetY: 0,
          opacity: obj.opacity,
          clipY: 0,
        };
        this.animatedObjects[obj.id] = {
          top: obj.top,
          clipPath: null,
          opacity: obj.opacity,
        };
        let offsetY;
        let clipY;
        if (effect.type === BLOCK_REVEAL_IN_BOTTOM) {
          offsetY = [obj.height * obj.scaleY, -obj.height * obj.scaleY - 1];
          clipY = [0, obj.height * 1.1];
        } else {
          offsetY = [-obj.height * obj.scaleY, obj.height * obj.scaleY + 1];
          clipY = [obj.height, -obj.height * 0.1];
        }
        Object.assign(option, {
          targets: target,
          offsetY,
          clipY,
          opacity: obj.opacity,
          update: (e) => {
            addedObject.set({
              top: target.offsetY,
              opacity: target.opacity,
            });
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: obj.width,
                height: target.clipY,
                top: obj.height / 2 - target.clipY,
                left: -obj.width / 2,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      }
      case BLOCK_REVEAL_IN_LEFT:
      case BLOCK_REVEAL_OUT_LEFT: {
        target = {
          offsetX: 0,
          opacity: obj.opacity,
          clipX: 0,
        };
        this.animatedObjects[obj.id] = { left: obj.left, clipPath: null };
        let offsetX;
        let clipX;
        if (effect.type === BLOCK_REVEAL_IN_LEFT) {
          offsetX = [-obj.width * obj.scaleX, obj.width * obj.scaleX + 1];
          clipX = [0, obj.width * 1.1];
        } else {
          offsetX = [obj.width * obj.scaleX, -obj.width * obj.scaleX - 1];
          clipX = [obj.width, -obj.width * 0.1];
        }
        Object.assign(option, {
          targets: target,
          offsetX,
          clipX,
          opacity: obj.opacity,
          update: (e) => {
            addedObject.set({
              left: target.offsetX,
              opacity: target.opacity,
            });
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: target.clipX,
                height: obj.height,
                top: -obj.height / 2,
                left: -obj.width / 2,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      }
      case BLOCK_REVEAL_IN_RIGHT:
      case BLOCK_REVEAL_OUT_RIGHT: {
        target = {
          offsetX: 0,
          opacity: obj.opacity,
          clipX: 0,
        };
        this.animatedObjects[obj.id] = { left: obj.left, clipPath: null };
        let offsetX;
        let clipX;
        if (effect.type === BLOCK_REVEAL_IN_RIGHT) {
          offsetX = [obj.width * obj.scaleX, -obj.width * obj.scaleX - 1];
          clipX = [0, obj.width * 1.1];
        } else {
          offsetX = [-obj.width * obj.scaleX, obj.width * obj.scaleX + 1];
          clipX = [obj.width, -obj.width * 0.1];
        }
        Object.assign(option, {
          targets: target,
          offsetX,
          clipX,
          opacity: obj.opacity,
          update: (e) => {
            addedObject.set({
              left: target.offsetX,
              opacity: target.opacity,
            });
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: target.clipX,
                height: obj.height,
                top: -obj.height / 2,
                left: obj.width / 2 - target.clipX,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      }
      case REVEAL_IN_BOTTOM:
      case REVEAL_IN_TOP:
      case REVEAL_OUT_BOTTOM:
      case REVEAL_OUT_TOP: {
        target = {
          top: 0,
          opacity: 0,
        };
        // this.animatedObjects[obj.id] = { top: obj.top, opacity: obj.opacity };

        let top;
        if (type === REVEAL_IN_TOP) {
          top = [-addedObject.height * addedObject.scaleY, 0];
        } else if (type === REVEAL_IN_BOTTOM) {
          top = [addedObject.height * addedObject.scaleY, 0];
        } else if (type === REVEAL_OUT_BOTTOM) {
          top = [0, addedObject.height * addedObject.scaleY];
        } else {
          top = [0, -addedObject.height * addedObject.scaleY];
        }
        let opacity1;
        if (type === REVEAL_IN_TOP || type === REVEAL_IN_BOTTOM) {
          opacity1 = [0, obj.opacity];
        } else {
          opacity1 = [obj.opacity, 0];
        }

        obj.set({
          opacity: 0,
        });

        const originTop = (-addedObject.height * addedObject.scaleY) / 2;
        Object.assign(option, {
          targets: target,
          top,
          opacity: opacity1,
          update: (e) => {
            addedObject.set({
              opacity: target.opacity,
              top: originTop + target.top,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      }
      case REVEAL_IN_LEFT:
      case REVEAL_IN_RIGHT:
      case REVEAL_OUT_LEFT:
      case REVEAL_OUT_RIGHT: {
        target = {
          left: 0,
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { left: obj.left, opacity: obj.opacity };

        let left;
        if (type === REVEAL_IN_LEFT) {
          left = [-addedObject.width * addedObject.scaleX, 0];
        } else if (type === REVEAL_IN_RIGHT) {
          left = [addedObject.width * addedObject.scaleX, 0];
        } else if (type === REVEAL_OUT_LEFT) {
          left = [0, -addedObject.width * addedObject.scaleX];
        } else {
          left = [0, addedObject.width * addedObject.scaleX];
        }
        let opacity2;
        if (type === REVEAL_IN_LEFT || type === REVEAL_IN_RIGHT) {
          opacity2 = [0, obj.opacity];
        } else {
          opacity2 = [obj.opacity, 0];
        }

        obj.set({
          opacity: 0,
        });

        const originLeft = (-addedObject.width * addedObject.scaleX) / 2;
        Object.assign(option, {
          targets: target,
          left,
          opacity: opacity2,
          update: (e) => {
            addedObject.set({
              opacity: target.opacity,
              left: originLeft + target.left,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      }
      default:
        return [];
    }
  };
  /**
   * Get animation option
   *
   * @param {FabricObject} obj
   * @param {boolean} [hasControls]
   * @returns
   */
  getGroupLevelAnimations = (obj, effect, artboardDuration) => {
    if (!effect) {
      return;
    }
    const {
      delay = 0,
      trans_duration = 1000,
      autoplay = true,
      loop = false,
      type,
      easing = "easeOutQuart",
      direction = "normal",
    } = effect;
    const { workarea } = this.handler;
    const option = {
      loop,
      duration: trans_duration,
      direction,
      easing,
    };
    let target;
    switch (type) {
      case FADE_IN:
        target = {
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          opacity: [0, obj.opacity],
          update: (e) => {
            obj.set({
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FADE_OUT:
        target = {
          opacity: 1,
        };
        // this.animatedObjects[obj.id] = { opacity: 1 };
        Object.assign(option, {
          targets: target,
          opacity: [obj.opacity, -0.1],
          update: (e) => {
            obj.set({
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case ZOOM_IN:
        target = {
          scaleX: 0,
          scaleY: 0,
          opacity: obj.opacity,
        };
        // this.animatedObjects[obj.id] = { opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          scaleX: [0, obj.scaleX],
          scaleY: [0, obj.scaleY],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              scaleX: target.scaleX,
              scaleY: target.scaleY,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case ZOOM_OUT:
        target = {
          scaleX: 0,
          scaleY: 0,
          opacity: obj.opacity,
        };
        Object.assign(option, {
          targets: target,
          scaleX: [obj.scaleX, 0],
          scaleY: [obj.scaleY, 0],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              scaleX: target.scaleX,
              scaleY: target.scaleY,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case ZOOM_IN_BOUNCE:
        target = {
          scaleX: 0,
          scaleY: 0,
          opacity: obj.opacity,
        };
        // this.animatedObjects[obj.id] = { opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          scaleX: [0, obj.scaleX],
          scaleY: [0, obj.scaleY],
          opacity: obj.opacity,
          easing: "easeOutBounce",
          update: (e) => {
            obj.set({
              scaleX: target.scaleX,
              scaleY: target.scaleY,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case ZOOM_OUT_BOUNCE:
        target = {
          scaleX: 0,
          scaleY: 0,
          opacity: obj.opacity,
        };
        Object.assign(option, {
          targets: target,
          scaleX: [obj.scaleX, 0],
          scaleY: [obj.scaleY, 0],
          opacity: obj.opacity,
          easing: "easeOutQuart",
          update: (e) => {
            obj.set({
              scaleX: target.scaleX,
              scaleY: target.scaleY,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case STOMP:
        target = {
          scaleX: 0,
          scaleY: 0,
          opacity: obj.opacity,
        };
        // this.animatedObjects[obj.id] = { opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          scaleX: [3 * obj.scaleX, obj.scaleX],
          scaleY: [3 * obj.scaleY, obj.scaleY],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              scaleX: target.scaleX,
              scaleY: target.scaleY,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case BREATHE:
        target = {
          scaleX: 0,
          scaleY: 0,
          opacity: obj.opacity,
        };
        // this.animatedObjects[obj.id] = { opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          scaleX: [0.8 * obj.scaleX, obj.scaleX],
          scaleY: [0.8 * obj.scaleY, obj.scaleY],
          opacity: obj.opacity,
          // duration: artboardDuration * 1000 || trans_duration,
          update: (e) => {
            obj.set({
              scaleX: target.scaleX,
              scaleY: target.scaleY,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case PULSE:
        target = {
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          opacity: [0, obj.opacity],
          duration: trans_duration / 6,
          update: (e) => {
            obj.set({
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
          {
            option,
            offset: trans_duration / 6,
          },
          {
            option,
            offset: (2 * trans_duration) / 6,
          },
          {
            option,
            offset: (3 * trans_duration) / 6,
          },
          {
            option,
            offset: (4 * trans_duration) / 6,
          },
          {
            option,
            offset: (5 * trans_duration) / 6,
          },
        ];
      case WIPE_IN_TOP:
      case WIPE_OUT_TOP:
        target = {
          offsetY: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity, clipPath: null };
        Object.assign(option, {
          targets: target,
          offsetY: type === WIPE_IN_TOP ? [0, obj.height] : [obj.height, 0],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: obj.width,
                height: target.offsetY,
                top: -obj.height / 2,
                left: -obj.width / 2,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case WIPE_IN_BOTTOM:
      case WIPE_OUT_BOTTOM:
        target = {
          offsetY: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity, clipPath: null };
        Object.assign(option, {
          targets: target,
          offsetY: type === WIPE_IN_BOTTOM ? [0, obj.height] : [obj.height, 0],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: obj.width,
                height: target.offsetY,
                top: obj.height / 2 - target.offsetY,
                left: -obj.width / 2,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case WIPE_IN_LEFT:
      case WIPE_OUT_LEFT:
        target = {
          offsetX: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity, clipPath: null };
        Object.assign(option, {
          targets: target,
          offsetX: type === WIPE_IN_LEFT ? [0, obj.width] : [obj.width, 0],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: target.offsetX,
                height: obj.height,
                top: -obj.height / 2,
                left: -obj.width / 2,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case WIPE_IN_RIGHT:
      case WIPE_OUT_RIGHT:
        target = {
          offsetX: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity, clipPath: null };
        Object.assign(option, {
          targets: target,
          offsetX: type === WIPE_IN_RIGHT ? [0, obj.width] : [obj.width, 0],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              opacity: target.opacity,
              clipPath: new fabric.Rect({
                width: target.offsetX,
                height: obj.height,
                top: -obj.height / 2,
                left: obj.width / 2 - target.offsetX,
              }),
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_IN_TOP:
        target = {
          top: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { top: obj.top, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          top: [workarea.top - obj.height, obj.top],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              top: target.top,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_OUT_TOP:
        target = {
          top: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { top: obj.top, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          top: [obj.top, workarea.top - obj.height],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              top: target.top,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_IN_BOTTOM:
        target = {
          top: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { top: obj.top, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          top: [workarea.top + workarea.height, obj.top],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              top: target.top,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_OUT_BOTTOM:
        target = {
          top: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { top: obj.top, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          top: [obj.top, workarea.top + workarea.height],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              top: target.top,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_IN_LEFT:
        target = {
          left: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { left: obj.left, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          left: [workarea.left - obj.width, obj.left],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              left: target.left,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_OUT_LEFT:
        target = {
          left: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { left: obj.left, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          left: [obj.left, workarea.left - obj.width],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              left: target.left,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_IN_RIGHT:
        target = {
          left: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { left: obj.left, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          left: [workarea.left + workarea.width, obj.left],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              left: target.left,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLY_OUT_RIGHT:
        target = {
          left: 0,
          opacity: obj.opacity,
        };
        this.animatedObjects[obj.id] = { left: obj.left, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          left: [obj.left, workarea.left + workarea.width],
          opacity: obj.opacity,
          update: (e) => {
            obj.set({
              left: target.left,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case SHIFT_TOP:
        target = {
          top: 0,
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { top: obj.top, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          top: [obj.top - workarea.height * 0.1, obj.top],
          opacity: [0, obj.opacity],
          update: (e) => {
            obj.set({
              top: target.top,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case SHIFT_BOTTOM:
        target = {
          top: 0,
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { top: obj.top, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          top: [obj.top + workarea.height * 0.1, obj.top],
          opacity: [0, obj.opacity],
          update: (e) => {
            obj.set({
              top: target.top,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case SHIFT_LEFT:
        target = {
          left: 0,
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { left: obj.left, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          left: [obj.left - workarea.width * 0.1, obj.left],
          opacity: [0, obj.opacity],
          update: (e) => {
            obj.set({
              left: target.left,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case SHIFT_RIGHT:
        target = {
          left: 0,
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { left: obj.left, opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          left: [obj.left + workarea.width * 0.1, obj.left],
          opacity: [0, obj.opacity],
          update: (e) => {
            obj.set({
              left: target.left,
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
        ];
      case FLICKER:
        target = {
          opacity: 0,
        };
        this.animatedObjects[obj.id] = { opacity: obj.opacity };
        Object.assign(option, {
          targets: target,
          opacity: [0, obj.opacity],
          duration: trans_duration / 6,
          update: (e) => {
            obj.set({
              opacity: target.opacity,
            });
            this.handler.canvas.requestRenderAll();
          },
        });
        return [
          {
            option,
            offset: 0,
          },
          {
            option,
            offset: trans_duration / 6,
          },
          {
            option,
            offset: (2 * trans_duration) / 6,
          },
          {
            option,
            offset: (3 * trans_duration) / 6,
          },
          {
            option,
            offset: (4 * trans_duration) / 6,
          },
          {
            option,
            offset: (5 * trans_duration) / 6,
          },
        ];
      case GLITCH:
        Object.assign(option, {});
        break;
      case DISCO:
        Object.assign(option, {});
        break;
      case STILL:
        Object.assign(option, {
          loop: false,
        });
        break;
      default:
        console.warn("Not supported type.");
        return null;
    }
  };

  updateArtboardAnimation = (animation) => {
    const { canvas, workarea } = this.handler;
    if (!workarea) {
      return;
    }
    let newAnimation = {
      duration: animation?.duration
        ? animation.duration
        : workarea.animation?.duration,
      transition: animation?.transition
        ? animation.transition
        : workarea.animation?.transition,
      preset: animation?.preset ? animation.preset : workarea.animation?.preset,
    };
    workarea.set({
      animation: newAnimation,
    });
    canvas.fire("object:modified", {
      target: workarea,
    });
  };

  addOrRemoveTransition = (animation) => {
    const { canvas, workarea } = this.handler;
    if (!workarea) {
      return;
    }
    workarea.set({
      animation: animation,
    });
    canvas.fire("object:modified", {
      target: workarea,
    });
  };

  getGroupLevelAnimationAddedObjects = (obj, effect) => {
    if (isEmpty(obj)) {
      return;
    }

    const state = store.getState();
    const newObj = fabric.util.object.clone(obj);
    const rect = new fabric.Rect({
      width: newObj.width * newObj.scaleX,
      height: newObj.height * newObj.scaleY,
      top: (-newObj.height * newObj.scaleY) / 2,
      left: (-newObj.width * newObj.scaleX) / 2,
      affectStroke: true,
    });
    const groupFormat = {
      left: newObj.left,
      top: newObj.top,
      width: newObj.width * newObj.scaleX,
      height: newObj.height * newObj.scaleY,
      angle: obj.angle,
      flipX: obj.flipX,
      flipY: obj.flipY,
      skewX: obj.skewX,
      skewY: obj.skewY,
      affectStroke: true,
    };
    const group = new fabric.Group(undefined, groupFormat);
    newObj.set({
      top: (-newObj.height * newObj.scaleY) / 2,
      left: (-newObj.width * newObj.scaleX) / 2,
      angle: 0,
      skewX: 0,
      skewY: 0,
      opacity: 0,
      shadow: obj.shadow
        ? new fabric.Shadow({
            color: obj.shadow.color,
            blur: obj.shadow.blur,
            nonScaling: true,
            includeDefaultValues: false,
            affectStroke: false,
            // offsetX: obj.shadow.offsetX,
            // offsetY: obj.shadow.offsetY,
          })
        : null,
    });
    if (newObj.type === FABRIC_VIDEO_ELEMENT) {
      newObj.set({
        objectCaching: true,
        statefullCache: true,
        cacheProperties: ["videoTime"],
      });
    }
    group.add(newObj);
    group.set({
      clipPath: rect,
    });
    this.handler.canvas.add(group);
    group.moveTo(state.layerstore.layers[obj.id].order + 1);

    this.addedAnimateObjects.push(group);
    this.animatedObjects[obj.id] = { opacity: obj.opacity };
    this.handler.canvas.requestRenderAll();

    if (effect.type.includes("reveal")) {
      return newObj;
    } else if (effect.type.includes("block")) {
      const width =
        effect.type === BLOCK_REVEAL_IN_LEFT ||
        effect.type === BLOCK_REVEAL_IN_RIGHT ||
        effect.type === BLOCK_REVEAL_OUT_LEFT ||
        effect.type === BLOCK_REVEAL_OUT_RIGHT
          ? obj.width * obj.scaleX * 0.8
          : obj.width * obj.scaleX;
      const height =
        effect.type === BLOCK_REVEAL_IN_TOP ||
        effect.type === BLOCK_REVEAL_IN_BOTTOM ||
        effect.type === BLOCK_REVEAL_OUT_TOP ||
        effect.type === BLOCK_REVEAL_OUT_BOTTOM
          ? obj.height * obj.scaleY * 0.8
          : obj.height * obj.scaleY;
      const maskRect = new fabric.Rect({
        left: 0,
        top: 0,
        width,
        height,
        flipX: obj.flipX,
        flipY: obj.flipY,
        fill:
          obj.fill !== "rgba(0,0,0,0)"
            ? obj.fill
            : obj.textBackgroundColor !== "rgba(0,0,0,0)"
            ? obj.textBackgroundColor
            : obj.stroke,
        originX: "center",
        originY: "center",
        opacity: 0,
      });
      group.add(maskRect);
      this.handler.canvas.requestRenderAll();
      return maskRect;
    }
  };

  getCharactersAndGroup = (obj, effect) => {
    const state = store.getState();
    const radian = (-obj.angle * Math.PI) / 180;
    const width =
      Math.abs((obj.aCoords.tr.x - obj.aCoords.tl.x) / Math.cos(radian)) *
      obj.scaleX;
    const height =
      Math.abs((obj.aCoords.bl.y - obj.aCoords.tl.y) / Math.cos(radian)) *
      obj.scaleY;
    const groupFormat = obj
      ? {
          left: obj.left,
          top: obj.top - (obj.height * obj.scaleY * 3) / 2,
          width: width,
          height: height * 4,
          angle: obj.angle,
          borderColor: obj.editingBorderColor,
          flipX: obj.flipX,
          flipY: obj.flipY,
          opacity: 1,
          skewX: obj.skewX,
          skewY: obj.skewY,
          strokeWidth: obj.strokeWidth,
          strokeMiterLimit: obj.strokeMiterLimit,
          visible: obj.visible,
        }
      : {};
    const lettersGroup = new fabric.Group(undefined, groupFormat);
    this.handler.canvas.add(lettersGroup);

    this.addedAnimateObjects.push(lettersGroup);
    this.animatedObjects[obj.id] = { opacity: obj.opacity };

    const backgroundRect = new fabric.Rect({
      left: 0,
      top: 0,
      width: obj.width * obj.scaleX,
      height: obj.height * obj.scaleY,
      flipX: obj.flipX,
      flipY: obj.flipY,
      fill: obj.backgroundColor,
      originX: "center",
      originY: "center",
    });
    lettersGroup.add(backgroundRect);
    this.addedAnimateObjects.push(backgroundRect);
    lettersGroup.moveTo(state.layerstore.layers[obj.id].order + 1);

    let letters = [];
    if (obj.textLines && obj.textLines.length > 0) {
      obj.textLines.forEach((textLine, lineIndex) => {
        const textLength = obj._measureLine(lineIndex).width;
        const lineHeight = obj.getHeightOfLine(lineIndex);
        let lineYPosition = 0;
        for (let i = 0; i < lineIndex; i++) {
          lineYPosition += obj.scaleY * obj.getHeightOfLine(i);
        }
        if (effect.type === COFFEE_MORNINGS) {
          lineYPosition += lineHeight * obj.scaleY;
        } else {
          lineYPosition += (lineHeight * obj.scaleY) / 2;
        }
        if (lineYPosition < (obj.height * obj.scaleY) / 2) {
          lineYPosition = -((obj.height * obj.scaleY) / 2) + lineYPosition;
        } else {
          lineYPosition = lineYPosition - (obj.height * obj.scaleY) / 2;
        }
        const charHeights = obj.__charBounds[lineIndex].map(
          (item) => item.height
        );
        charHeights.pop();
        const maxHeight = Math.max(...charHeights);
        const lineLetters = textLine.split("").map((char, charIndex) => {
          let left;
          if (obj.textAlign === "left") {
            left =
              -width / 2 +
              obj.__charBounds[lineIndex][charIndex].left * obj.scaleX;
          } else if (obj.textAlign === "center") {
            left =
              obj.__charBounds[lineIndex][charIndex].left * obj.scaleX -
              (textLength * obj.scaleX) / 2;
          } else {
            left =
              width / 2 -
              textLength * obj.scaleX +
              obj.__charBounds[lineIndex][charIndex].left * obj.scaleX;
          }
          const charStyle = obj._getStyleDeclaration(lineIndex, charIndex);
          return new fabric.Text(char, {
            originX: "left",
            originY: effect.type === COFFEE_MORNINGS ? "bottom" : "center",
            width: obj.__charBounds[lineIndex][charIndex].width * obj.scaleX,
            height: lineHeight * obj.scaleY,
            left,
            top:
              lineYPosition +
              (effect.type === COFFEE_MORNINGS
                ? 0
                : (maxHeight * obj.scaleY -
                    obj.__charBounds[lineIndex][charIndex].height *
                      obj.scaleY) /
                  3.2),
            fontFamily: obj.fontFamily,
            fontSize: obj.fontSize,
            lineHeight: obj.lineHeight,
            fontWeight: obj.fontWeight,
            fontStyle: obj.fontStyle,
            fill: obj.fill,
            fillRule: obj.fillRule,
            paintFirst: obj.paintFirst,
            opacity: 0,
            zoomX: obj.zoomX,
            zoomY: obj.zoomY,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            borderColor: obj.borderColor,
            backgroundColor: obj.backgroundColor,
            shadow: obj.shadow,
            stroke: obj.stroke,
            strokeDashArray: obj.strokeDashArray,
            strokeDashOffset: obj.strokeDashOffset,
            strokeLineCap: obj.strokeLineCap,
            strokeLineJoin: obj.strokeLineJoin,
            strokeMiterLimit: obj.strokeMiterLimit,
            strokeUniform: obj.strokeUniform,
            textBackgroundColor: obj.textBackgroundColor,
            underline: obj.underline,
            ...charStyle,
          });
        });
        letters = [...letters, ...lineLetters];
      });
    }

    letters.forEach((letter) => {
      lettersGroup.add(letter);
    });
    return { letters, lettersGroup };
  };

  getCharacterLevelAnimationAddedObjects = (obj, effect) => {
    const { letters, lettersGroup } = this.getCharactersAndGroup(obj, effect);

    if (effect.type === FIND_YOUR_ELEMENT) {
      const bottomLine = new fabric.Line(
        [
          obj.aCoords.br.x - obj.width,
          obj.aCoords.br.y,
          obj.aCoords.br.x,
          obj.aCoords.br.y,
        ],
        {
          fill: obj.fill,
          stroke: obj.fill,
          strokeWidth: 4,
          originX: "right",
          selectable: false,
          opacity: 0,
          angle: obj.angle,
        }
      );
      this.addedAnimateObjects.push(bottomLine);
      return {
        letters,
        lettersGroup,
        bottomLine,
      };
    }
    if (effect.type === THURSDAY) {
      const topLine = new fabric.Line(
        [obj.left, obj.top, obj.left + obj.width, obj.top],
        {
          fill: obj.fill,
          stroke: obj.fill,
          strokeWidth: 4,
          originX: "left",
          selectable: false,
          opacity: 0,
          angle: obj.angle,
        }
      );
      const bottomLine = new fabric.Line(
        [
          obj.aCoords.bl.x,
          obj.aCoords.bl.y,
          obj.aCoords.bl.x + obj.width,
          obj.aCoords.bl.y,
        ],
        {
          fill: obj.fill,
          stroke: obj.fill,
          strokeWidth: 4,
          originX: "left",
          selectable: false,
          opacity: 0,
          angle: obj.angle,
        }
      );
      this.addedAnimateObjects.push(bottomLine);
      this.addedAnimateObjects.push(topLine);
      return {
        letters,
        lettersGroup,
        bottomLine,
        topLine,
      };
    }
    if (effect.type === HELLO_GOODBYE) {
      const leftLine = new fabric.Line(
        [
          obj.left -
            (obj.height * obj.scaleY * Math.sin((obj.angle * Math.PI) / 180)) /
              2,
          obj.top +
            (obj.height * obj.scaleY * Math.cos((obj.angle * Math.PI) / 180)) /
              2 -
            (obj.height * obj.scaleY) / 2,
          obj.left -
            (obj.height * obj.scaleY * Math.sin((obj.angle * Math.PI) / 180)) /
              2,
          obj.top +
            (obj.height * obj.scaleY * Math.cos((obj.angle * Math.PI) / 180)) /
              2 +
            (obj.height * obj.scaleY) / 2,
        ],
        {
          fill: obj.fill,
          stroke: obj.fill,
          strokeWidth: 4,
          originX: "left",
          originY: "center",
          selectable: false,
          angle: obj.angle,
        }
      );
      this.addedAnimateObjects.push(leftLine);
      return {
        letters,
        lettersGroup,
        leftLine,
      };
    }
    if (effect.type === SIGNALS_NOISES) {
      const topLine = new fabric.Line(
        [
          obj.left,
          obj.top + obj.height / 2,
          obj.left + obj.width,
          obj.top + obj.height / 2,
        ],
        {
          fill: "#000000",
          stroke: "#000000",
          strokeWidth: 4,
          originX: "center",
          selectable: false,
        }
      );
      const bottomLine = new fabric.Line(
        [
          obj.left,
          obj.top + obj.height / 2,
          obj.left + obj.width,
          obj.top + obj.height / 2,
        ],
        {
          fill: "#000000",
          stroke: "#000000",
          strokeWidth: 4,
          originX: "center",
          selectable: false,
        }
      );
      this.addedAnimateObjects.push(topLine);
      this.addedAnimateObjects.push(bottomLine);
      return {
        letters,
        lettersGroup,
        topLine,
        bottomLine,
      };
    }
    if (effect.type === GLITCH) {
      const { letters: letters1, lettersGroup: lettersGroup1 } =
        this.getCharactersAndGroup(obj, effect);
      const { letters: letters2, lettersGroup: lettersGroup2 } =
        this.getCharactersAndGroup(obj, effect);
      this.addedAnimateObjects.push(letters1);
      this.addedAnimateObjects.push(lettersGroup1);
      this.addedAnimateObjects.push(letters2);
      this.addedAnimateObjects.push(lettersGroup2);
      return {
        letters,
        lettersGroup,
        letters1,
        lettersGroup1,
        letters2,
        lettersGroup2,
      };
    }

    return {
      letters,
      lettersGroup,
    };
  };

  getCharacterLevelAnimations = (
    obj,
    effect,
    addedObjects,
    hasControls = false
  ) => {
    // obj.set({
    //   opacity: 0,
    // });

    const { letters, lettersGroup } = addedObjects;
    const letter = obj.text;
    const letterBounds = letters.map((letter) => ({
      width: letter.width,
      height: letter.height,
      top: letter.top,
      left: letter.left,
    }));
    const lineIndex = 0;
    const textLength = obj?.__lineWidths ? obj.__lineWidths[lineIndex] : 0;

    const canvas = this.handler.canvas;
    const radian = (-obj.angle * Math.PI) / 180;
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    const run = (obj.width * obj.scaleX) / 2;
    const rise = (obj.height * obj.scaleY) / 2;
    lettersGroup.set({
      originX: "center",
      originY: "center",
      left: cos * run + sin * rise + obj.left,
      top: cos * rise - sin * run + obj.top,
    });

    if (effect.type === GLITCH) {
      const { letters1, lettersGroup1, letters2, lettersGroup2 } = addedObjects;
      const radian = (-obj.angle * Math.PI) / 180;
      const cos = Math.cos(radian);
      const sin = Math.sin(radian);
      const run = (obj.width * obj.scaleX) / 2;
      const rise = (obj.height * obj.scaleY) / 2;
      lettersGroup1.set({
        originX: "center",
        originY: "center",
        left: cos * run + sin * rise + obj.left,
        top: cos * rise - sin * run + obj.top,
      });
      lettersGroup2.set({
        originX: "center",
        originY: "center",
        left: cos * run + sin * rise + obj.left,
        top: cos * rise - sin * run + obj.top,
      });
      canvas.renderAll();

      const animation = {
        letterOpacity: 1,
        clipHeight: 0,
      };
      this.letterLevelAnimations.push(animation);
      const animationOptions = [];

      for (let i = 0; i < 20; i++) {
        let color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        })`;
        let offsetX =
          Math.floor((Math.random() * 21 - 10) * obj.scaleX) +
          (obj.width * obj.scaleX) / 2;
        let offsetY =
          Math.floor((Math.random() * 21 - 10) * obj.scaleY) +
          (obj.height * obj.scaleY) / 2;
        let clipY = Math.floor((Math.random() * letters[1].height) / 2);
        let topY = Math.floor(Math.random() * letters[1].height);
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            easing: effect.easing,
            duration: 40,
            update: function () {
              letters1.forEach((item, index) => {
                item.set({
                  opacity: 0,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i,
        });
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            clipHeight: [0, clipY],
            easing: effect.easing,
            duration: 60,
            update: function () {
              letters1.forEach((item, index) => {
                item.set({
                  opacity: animation.opacity,
                  fill: color,
                });
                item.clipPath = new fabric.Rect({
                  width: item.width,
                  height: animation.clipHeight,
                  top: -topY / 2,
                  left: -item.width / 2,
                });
              });
              lettersGroup1.set({
                left: obj.left + offsetX,
                top: obj.top + offsetY,
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 40,
        });
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            easing: effect.easing,
            duration: 40,
            update: function () {
              letters1.forEach((item, index) => {
                item.set({
                  opacity: 0,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 100,
        });
        color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        })`;
        offsetX =
          Math.floor((Math.random() * 21 - 10) * obj.scaleX) +
          (obj.width * obj.scaleX) / 2;
        offsetY =
          Math.floor((Math.random() * 21 - 10) * obj.scaleY) +
          (obj.height * obj.scaleY) / 2;
        clipY = Math.floor((Math.random() * letters[1].height) / 2);
        topY = Math.floor(Math.random() * letters[1].height);
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            clipHeight: [0, clipY],
            easing: effect.easing,
            duration: 40,
            update: function () {
              letters1.forEach((item, index) => {
                item.set({
                  opacity: animation.opacity,
                  fill: color,
                });
                item.clipPath = new fabric.Rect({
                  width: item.width,
                  height: animation.clipHeight,
                  top: -topY / 2,
                  left: -item.width / 2,
                });
              });
              lettersGroup1.set({
                left: obj.left + offsetX,
                top: obj.top + offsetY,
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 140,
        });
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            easing: effect.easing,
            duration: 20,
            update: function () {
              letters1.forEach((item, index) => {
                item.set({
                  opacity: 0,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 180,
        });
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            easing: effect.easing,
            duration: 50,
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  opacity: 1,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        });
      }

      for (let i = 0; i < 20; i++) {
        let color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        })`;
        let offsetX =
          Math.floor((Math.random() * 21 - 10) * obj.scaleX) +
          (obj.width * obj.scaleX) / 2;
        let offsetY =
          Math.floor((Math.random() * 21 - 10) * obj.scaleY) +
          (obj.height * obj.scaleY) / 2;
        let clipY = Math.floor((Math.random() * letters[2].height) / 2);
        let topY = Math.floor(Math.random() * letters[2].height);
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            easing: effect.easing,
            duration: 40,
            update: function () {
              letters2.forEach((item, index) => {
                item.set({
                  opacity: 0,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i,
        });
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            clipHeight: [0, clipY],
            easing: effect.easing,
            duration: 60,
            update: function () {
              letters2.forEach((item, index) => {
                item.set({
                  opacity: animation.opacity,
                  fill: color,
                });
                item.clipPath = new fabric.Rect({
                  width: item.width,
                  height: animation.clipHeight,
                  top: -topY / 2,
                  left: -item.width / 2,
                });
              });
              lettersGroup2.set({
                left: obj.left + offsetX,
                top: obj.top + offsetY,
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 40,
        });
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            easing: effect.easing,
            duration: 40,
            update: function () {
              letters2.forEach((item, index) => {
                item.set({
                  opacity: 0,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 100,
        });
        color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        })`;
        offsetX =
          Math.floor((Math.random() * 21 - 10) * obj.scaleX) +
          (obj.width * obj.scaleX) / 2;
        offsetY =
          Math.floor((Math.random() * 21 - 10) * obj.scaleY) +
          (obj.height * obj.scaleY) / 2;
        clipY = Math.floor((Math.random() * letters[1].height) / 2);
        topY = Math.floor(Math.random() * letters[1].height);
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            clipHeight: [0, clipY],
            easing: effect.easing,
            duration: 40,
            update: function () {
              letters2.forEach((item, index) => {
                item.set({
                  opacity: animation.opacity,
                  fill: color,
                });
                item.clipPath = new fabric.Rect({
                  width: item.width,
                  height: animation.clipHeight,
                  top: -topY / 2,
                  left: -item.width / 2,
                });
              });
              lettersGroup2.set({
                left: obj.left + offsetX,
                top: obj.top + offsetY,
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 140,
        });
        animationOptions.push({
          option: {
            targets: animation,
            letterOpacity: 1,
            easing: effect.easing,
            duration: 20,
            update: function () {
              letters2.forEach((item, index) => {
                item.set({
                  opacity: 0,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 200 * i + 180,
        });
      }

      return [...animationOptions];
    } else if (effect.type === DISCO) {
      const animation1 = {
        letterOpacity: 1,
      };
      this.letterLevelAnimations.push(animation1);
      const animationOptions = [];
      let durationSum = 0;
      for (let i = 0; i < 16; i++) {
        const duration = Math.floor(Math.random() * 200);
        const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        })`;
        animationOptions.push({
          option: {
            targets: animation1,
            letterOpacity: 1,
            easing: effect.easing,
            duration,
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  opacity: animation1.opacity,
                  fill: color,
                });
              });
              canvas.renderAll();
            },
          },
          offset: durationSum,
        });
        durationSum = durationSum + duration;
      }
      return animationOptions;
    } else if (effect.type === FADE_IN || effect.type === FADE_OUT) {
      const animation = {
        opacity: effect.type === FADE_IN ? 0 : 1,
        letterOpacity: 1,
      };
      this.letterLevelAnimations.push(animation);
      return [
        {
          option: {
            targets: animation,
            opacity: effect.type === FADE_IN ? [0, 1] : [1, 0],
            letterOpacity: 1,
            easing: effect.easing,
            duration: effect.trans_duration,
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  opacity: animation.letterOpacity,
                });
              });
              lettersGroup.set({
                opacity: animation.opacity,
              });
              if (effect.type === FADE_OUT) {
                if (addedObjects.bottomLine) {
                  addedObjects.bottomLine.set({
                    opacity: animation.opacity,
                  });
                }
                if (addedObjects.topLine) {
                  addedObjects.topLine.set({
                    opacity: animation.opacity,
                  });
                }
                if (addedObjects.leftLine) {
                  addedObjects.leftLine.set({
                    opacity: animation.opacity,
                  });
                }
              }
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === GREAT_THINKER) {
      const animation = letter.split("").map((item, index) => ({
        opacity: 0,
        index,
      }));
      this.letterLevelAnimations.push(animation);
      const characterDelay = effect.trans_duration / letter.length;
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      return [
        {
          option: {
            targets: animation,
            opacity: [0, obj.opacity],
            easing: "easeInOutQuad",
            delay: (el, i) => characterDelay * i,
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  opacity: animation[index].opacity,
                });
              });
              canvas.requestRenderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === SUNNY_MORNINGS) {
      const animation = letter.split("").map((item, index) => ({
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        opacity: 0,
        translateZ: 0,
        index,
      }));
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      this.letterLevelAnimations.push(animation);
      const characterDelay = effect.trans_duration / letter.length;
      return [
        {
          option: {
            targets: animation,
            scaleX: [4, obj.scaleX],
            scaleY: [4, obj.scaleY],
            opacity: [0, obj.opacity],
            translateZ: 0,
            easing: "easeOutExpo",
            delay: (el, i) => characterDelay * i,
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  scaleX: animation[index].scaleX,
                  scaleY: animation[index].scaleY,
                  opacity: animation[index].opacity,
                });
              });
              lettersGroup.addWithUpdate();
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === RISING_STRONG_IN) {
      const animation = letter.split("").map((item, index) => ({
        opacity: 0,
        translateY: 0,
        index,
      }));
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      this.letterLevelAnimations.push(animation);
      const characterDelay = effect.trans_duration / letter.length;
      return [
        {
          option: {
            targets: animation,
            translateY: [100 * obj.scaleY, 0],
            opacity: [0, obj.opacity],
            easing: "easeOutExpo",
            delay: (el, i) => (characterDelay * i * 1400) / 2600,
            update: function () {
              letters.forEach((item, index) => {
                const originTop = letterBounds[index].top;
                item.set({
                  top: animation[index].translateY + originTop,
                  opacity: animation[index].opacity,
                });
              });
              canvas.renderAll();
              // lettersGroup.addWithUpdate();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === RISING_STRONG_OUT) {
      let animation = letter.split("").map((item, index) => ({
        opacity: 0,
        translateY: 0,
        index,
      }));
      this.letterLevelAnimations.push(animation);
      const characterDelay = effect.trans_duration / letter.length;
      return [
        {
          option: {
            targets: animation,
            opacity: [obj.opacity, 0],
            translateY: [0, -100 * obj.scaleY],
            easing: "easeInExpo",
            delay: (el, i) => (characterDelay * i * 1200) / 2600,
            update: function () {
              letters.forEach((item, index) => {
                const originTop = letterBounds[index].top;
                item.set({
                  top: originTop + animation[index].translateY,
                  opacity: animation[index].opacity,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === MADE_WITH_LOVE) {
      const animation = letter.split("").map((item, index) => ({
        translateY: 0,
        opacity: obj.opacity,
        index,
      }));
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      this.letterLevelAnimations.push(animation);
      const characterDelay = effect.trans_duration / letter.length;
      return [
        {
          option: {
            targets: animation,
            translateY: [obj.height * obj.scaleY, 0],
            opacity: obj.opacity,
            easing: "easeOutExpo",
            delay: (el, i) => characterDelay * i,
            update: function () {
              letters.forEach((item, index) => {
                const originTop = letterBounds[index].top;
                item.set({
                  top: -animation[index].translateY + originTop,
                  opacity: animation[index].opacity,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === BEAUTIFUL_QUESTIONS) {
      const animation = letter.split("").map((item, index) => ({
        translateY: 0,
        opacity: obj.opacity,
        index,
      }));
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      this.letterLevelAnimations.push(animation);
      const characterDelay = effect.trans_duration / letter.length;
      return [
        {
          option: {
            targets: animation,
            translateY: [obj.height * obj.scaleY + 30 * obj.scaleY, 0],
            opacity: obj.opacity,
            delay: (el, i) => characterDelay * i,
            begin: () => {
              lettersGroup.clipPath = new fabric.Rect({
                width: lettersGroup.width,
                height: lettersGroup.height / 4 + 60 * obj.scaleY,
                top: -lettersGroup.height / 8 - 30 * obj.scaleY,
                left: -lettersGroup.width / 2,
              });
              canvas.renderAll();
            },
            update: function () {
              letters.forEach((item, index) => {
                const originTop = letterBounds[index].top;
                item.set({
                  top: animation[index].translateY + originTop,
                  opacity: animation[index].opacity,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === DOMINO_DREAMS) {
      const animation = letter.split("").map((item, index) => ({
        rotateY: 0,
        opacity: 0,
        index,
      }));
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      this.letterLevelAnimations.push(animation);
      const characterDelay = effect.trans_duration / letter.length;
      return [
        {
          option: {
            targets: animation,
            rotateY: [-90, 0],
            opacity: [0, obj.opacity],
            delay: (el, i) => characterDelay * i,
            update: function () {
              letters.forEach((item, index) => {
                item.rotate(animation[index].rotateY);
                item.set({
                  opacity: animation[index].opacity,
                });
              });
              lettersGroup.addWithUpdate();
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === FIND_YOUR_ELEMENT) {
      const { bottomLine } = addedObjects;
      canvas.add(bottomLine);
      canvas.renderAll();
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      const animation1 = {
        scaleX: 0,
        opacity: 0,
      };
      const animation2 = letter.split("").map((item, index) => ({
        opacity: 0,
        translateX: 0,
        scaleX: obj.scaleX,
        index,
      }));
      const animation3 = {
        opacity: obj.opacity,
      };
      this.letterLevelAnimations.push(animation1);
      this.letterLevelAnimations.push(animation2);
      this.letterLevelAnimations.push(animation3);
      const totalDuration = 2700;
      return [
        {
          option: {
            targets: animation1,
            scaleX: [0, obj.scaleX],
            opacity: [0, obj.opacity],
            easing: "easeInOutExpo",
            duration: (900 * effect.trans_duration) / totalDuration,
            begin: () => {
              lettersGroup.clipPath = new fabric.Rect({
                width: lettersGroup.width,
                height: lettersGroup.height,
                top: -lettersGroup.height / 2,
                left: -lettersGroup.width / 2,
              });
              canvas.renderAll();
            },
            update: function () {
              bottomLine.set({
                scaleX: animation1.scaleX,
                opacity: animation1.opacity,
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
        {
          option: {
            targets: animation2,
            opacity: [0, obj.opacity],
            translateX: [80, 0],
            scaleX: [0, obj.scaleX],
            easing: "easeOutExpo",
            duration: (800 * effect.trans_duration) / totalDuration,
            delay: (el, i) =>
              (150 * effect.trans_duration) / totalDuration +
              (25 * i * effect.trans_duration) / totalDuration,
            update: function () {
              letters.forEach((item, index) => {
                let originLeft = letterBounds[index].left;
                item.set({
                  scaleX: animation2[index].scaleX,
                  opacity: animation2[index].opacity,
                  left: originLeft + animation2[index].translateX,
                });
              });
              canvas.renderAll();
            },
          },
          offset: (200 * effect.trans_duration) / totalDuration,
        },
      ];
    } else if (effect.type === THURSDAY) {
      const { topLine, bottomLine } = addedObjects;
      canvas.add(topLine);
      canvas.add(bottomLine);
      canvas.renderAll();
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      const animation1 = letter.split("").map((item, index) => ({
        opacity: 0,
        scaleX: 0,
        scaleY: 0,
        index,
      }));
      const animation2 = {
        scaleX: 0,
        opacity: 0,
      };
      const animation3 = {
        opacity: obj.opacity,
      };
      this.letterLevelAnimations.push(animation1);
      this.letterLevelAnimations.push(animation2);
      this.letterLevelAnimations.push(animation3);
      const totalDuration = 2700;
      return [
        {
          option: {
            targets: animation1,
            scaleX: [0, obj.scaleX],
            scaleY: [0, obj.scaleY],
            opacity: [0, obj.opacity],
            easing: "easeOutExpo",
            duration: (600 * effect.trans_duration) / totalDuration,
            delay: (el, i) =>
              (70 * (i + 1) * effect.trans_duration) / totalDuration,
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  scaleX: animation1[index].scaleX,
                  scaleY: animation1[index].scaleY,
                  opacity: animation1[index].opacity,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
        {
          option: {
            targets: animation2,
            opacity: [0, obj.opacity],
            scaleX: [0, obj.scaleX],
            easing: "easeOutExpo",
            duration: (1500 * effect.trans_duration) / totalDuration,
            update: function () {
              topLine.set({
                scaleX: animation2.scaleX,
                opacity: animation2.opacity,
              });
              bottomLine.set({
                scaleX: animation2.scaleX,
                opacity: animation2.opacity,
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === HELLO_GOODBYE) {
      const { leftLine } = addedObjects;
      canvas.add(leftLine);
      canvas.renderAll();
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      const animation1 = {
        opacity: 0.5,
        scaleY: 0,
      };
      const animation2 = {
        translateX: 0,
      };
      const animation3 = letter.split("").map((item, index) => ({
        opacity: 0,
        index,
      }));
      const animation4 = {
        opacity: obj.opacity,
      };
      this.letterLevelAnimations.push(animation1);
      this.letterLevelAnimations.push(animation2);
      this.letterLevelAnimations.push(animation3);
      this.letterLevelAnimations.push(animation4);
      const originX = leftLine.left;
      const originY = leftLine.top;
      return [
        {
          option: {
            targets: animation1,
            scaleY: [0, 1],
            opacity: [0, obj.opacity],
            easing: "easeOutExpo",
            duration: 1000,
            update: function () {
              leftLine.set({
                scaleY: animation1.scaleY,
                opacity: animation1.opacity,
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
        {
          option: {
            targets: animation2,
            translateX: [0, obj.width * obj.scaleX],
            easing: "easeOutExpo",
            duration: 700,
            delay: 100,
            update: function () {
              leftLine.set({
                left:
                  originX +
                  animation2.translateX * Math.cos((obj.angle * Math.PI) / 180),
                top:
                  originY +
                  animation2.translateX * Math.sin((obj.angle * Math.PI) / 180),
              });
              canvas.renderAll();
            },
          },
          offset: 1000,
        },
        {
          option: {
            targets: animation3,
            opacity: [0, obj.opacity],
            easing: "easeOutExpo",
            duration: 600,
            delay: (el, i) => 34 * (i + 1),
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  opacity: animation3[index].opacity,
                });
              });
              canvas.renderAll();
            },
          },
          offset: 1000,
        },
      ];
    } else if (effect.type === COFFEE_MORNINGS) {
      const animation1 = letter.split("").map((item, index) => ({
        scaleX: 0,
        scaleY: 0,
        opacity: obj.opacity,
        index,
      }));
      let animation2 = {
        opacity: obj.opacity,
      };
      this.letterLevelAnimations.push(animation1);
      this.letterLevelAnimations.push(animation2);
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      const characterDelay = effect.trans_duration / letter.length;
      return [
        {
          option: {
            targets: animation1,
            scaleX: [0, obj.scaleX],
            scaleY: [0, obj.scaleY],
            opacity: obj.opacity,
            elasticity: 600,
            delay: (el, i) => characterDelay * (i + 1),
            update: function () {
              letters.forEach((item, index) => {
                item.set({
                  scaleX: animation1[index].scaleX,
                  scaleY: animation1[index].scaleY,
                  opacity: animation1[index].opacity,
                });
              });
              lettersGroup.addWithUpdate();
              canvas.renderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === A_NEW_PRODUCTION_IN) {
      const animation = letter.split("").map((item, index) => ({
        opacity: 0,
        translateX: 0,
        index,
      }));
      this.letterLevelAnimations.push(animation);
      this.animatedObjects[obj.id] = { opacity: obj.opacity };
      return [
        {
          option: {
            targets: animation,
            translateX: [40, 0],
            opacity: [0, obj.opacity],
            easing: "easeOutExpo",
            duration: 1200,
            delay: (el, i) => 500 + 30 * i,
            begin: () => {
              lettersGroup.clipPath = new fabric.Rect({
                width: lettersGroup.width,
                height: lettersGroup.height,
                top: -lettersGroup.height / 2,
                left: -lettersGroup.width / 2,
              });
              canvas.requestRenderAll();
            },
            update: function () {
              letters.forEach((item, index) => {
                let originLeft = letterBounds[index].left;
                item.set({
                  left: originLeft + animation[index].translateX,
                  opacity: animation[index].opacity,
                });
              });
              canvas.requestRenderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === A_NEW_PRODUCTION_OUT) {
      const animation = letter.split("").map((item, index) => ({
        opacity: 0,
        translateX: 0,
        index,
      }));
      this.letterLevelAnimations.push(animation);
      return [
        {
          option: {
            targets: animation,
            opacity: [obj.opacity, 0],
            translateX: [0, -30],
            duration: 1100,
            easing: "easeInExpo",
            delay: (el, i) => 100 + 30 * i,
            update: function () {
              letters.forEach((item, index) => {
                let originLeft = letterBounds[index].left;
                item.set({
                  left: originLeft + animation[index].translateX,
                  opacity: animation[index].opacity,
                });
              });
              canvas.requestRenderAll();
            },
          },
          offset: 0,
        },
      ];
    } else if (effect.type === SIGNALS_NOISES) {
      const { topLine, bottomLine } = addedObjects;
      canvas.add(topLine);
      canvas.add(bottomLine);
      canvas.renderAll();

      const animation1 = {
        opacity: 0,
        scaleX: 0,
      };
      const animation2 = {
        translateY: 0,
      };
      const animation3 = {
        opacity: 0,
        scaleY: 0,
      };
      const animation4 = {
        opacity: 0,
        translateX: 0,
      };
      const animation5 = {
        opacity: 0,
        translateX: 0,
      };
      const animation6 = {
        opacity: 1,
      };
      this.letterLevelAnimations.push(animation1);
      this.letterLevelAnimations.push(animation2);
      this.letterLevelAnimations.push(animation3);
      this.letterLevelAnimations.push(animation4);
      this.letterLevelAnimations.push(animation5);
      this.letterLevelAnimations.push(animation6);
      return [
        {
          option: {
            targets: animation1,
            scaleX: [0, 1],
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 700,
            update: function () {
              topLine.set({
                scaleX: animation1.scaleX,
                opacity: animation1.opacity,
              });
              bottomLine.set({
                scaleX: animation1.scaleX,
                opacity: animation1.opacity,
              });
              canvas.renderAll();
            },
          },
          offset: 0,
        },
        {
          option: {
            targets: animation2,
            translateY: [0, obj.height / 2],
            easing: "easeOutExpo",
            duration: 600,
            update: function () {
              const topLineOriginY = obj.top + obj.height / 2;
              const bottomLineOriginY = obj.top + obj.height / 2;
              topLine.set({
                top: topLineOriginY - animation2.translateY,
              });
              bottomLine.set({
                top: bottomLineOriginY + animation2.translateY,
              });
              canvas.renderAll();
            },
          },
          offset: undefined,
        },
        {
          option: {
            targets: animation4,
            opacity: [0, 1],
            translateX: [40, 0],
            easing: "easeOutExpo",
            duration: 600,
            update: function () {
              for (let i = 0; i < 7; i++) {
                let originLeft;
                if (obj.textAlign === "left") {
                  originLeft =
                    -obj.width / 2 + (letterBounds ? letterBounds[i].left : 0);
                } else if (obj.textAlign === "center") {
                  originLeft =
                    (letterBounds ? letterBounds[i].left : 0) - textLength / 2;
                } else {
                  originLeft =
                    obj.width / 2 -
                    textLength +
                    (letterBounds ? letterBounds[i].left : 0);
                }
                letters[i].set({
                  opacity: animation4.opacity,
                  left: originLeft + animation4.translateX,
                });
              }
              for (let i = 8; i < 12; i++) {
                let originLeft;
                if (obj.textAlign === "left") {
                  originLeft =
                    -obj.width / 2 + (letterBounds ? letterBounds[i].left : 0);
                } else if (obj.textAlign === "center") {
                  originLeft =
                    (letterBounds ? letterBounds[i].left : 0) - textLength / 2;
                } else {
                  originLeft =
                    obj.width / 2 -
                    textLength +
                    (letterBounds ? letterBounds[i].left : 0);
                }
                letters[i].set({
                  opacity: animation4.opacity,
                  left: originLeft - animation4.translateX,
                });
              }
              canvas.renderAll();
            },
          },
          offset: "-=300",
        },
        {
          option: {
            targets: animation6,
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000,
            update: function () {
              letters.forEach((item) => {
                item.set({
                  opacity: animation6.opacity,
                });
              });
              topLine.set({
                opacity: animation6.opacity,
              });
              bottomLine.set({
                opacity: animation6.opacity,
              });
              canvas.renderAll();
            },
          },
          offset: undefined,
        },
      ];
    }
  };
}

export default AnimationHandler;
