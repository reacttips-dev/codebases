import { fabric } from "fabric";
import isEqual from "lodash/isEqual";

export const FILTER_TYPES = [
  "grayscale",
  "invert",
  "remove-color",
  "sepia",
  "brownie",
  "brightness",
  "contrast",
  "saturation",
  "noise",
  "vintage",
  "pixelate",
  "blur",
  "sharpen",
  "emboss",
  "technicolor",
  "polaroid",
  "blend-color",
  "gamma",
  "kodachrome",
  "blackwhite",
  "blend-image",
  "huerotation",
  "resize",
  "tint",
  "mask",
  "multiply",
  "sepia2",
];

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : false;

const SHARPEN_MATRIX = [0, -1, 0, -1, 5, -1, 0, -1, 0];
const EMBOSS_MATRIX = [1, 1, 1, 1, 0.7, -1, -1, -1, -1];

/**
 * Image Handler
 * @class ImageHandler
 * @implements {IBaseHandler}
 */
class ImageHandler {
  constructor(handler) {
    this.handler = handler;
  }

  initialize = () => {};

  /**
   * Create filter by type
   * @param {IFilter} filter
   */
  createFilter = (filter) => {
    const { type: filterType, ...other } = filter;
    const type = filterType.toLowerCase();
    if (type === "grayscale") {
      return new fabric.Image.filters.Grayscale(other);
    } else if (type === "invert") {
      return new fabric.Image.filters.Invert();
      // } else if (type === 'remove-color') {
      //     return new fabric.Image.filters.RemoveColor(other);
    } else if (type === "sepia") {
      return new fabric.Image.filters.Sepia();
    } else if (type === "brownie") {
      return new fabric.Image.filters.Brownie();
    } else if (type === "brightness") {
      return new fabric.Image.filters.Brightness({
        brightness: other.brightness,
      });
    } else if (type === "contrast") {
      return new fabric.Image.filters.Contrast(other);
    } else if (type === "saturation") {
      return new fabric.Image.filters.Saturation(other);
    } else if (type === "noise") {
      return new fabric.Image.filters.Noise({ noise: other.noise });
    } else if (type === "vintage") {
      return new fabric.Image.filters.Vintage();
    } else if (type === "pixelate") {
      return new fabric.Image.filters.Pixelate(other);
    } else if (type === "blur") {
      return new fabric.Image.filters.Blur(other);
    } else if (type === "sharpen") {
      return new fabric.Image.filters.Convolute({
        matrix: SHARPEN_MATRIX,
      });
    } else if (type === "emboss") {
      return new fabric.Image.filters.Convolute({
        matrix: EMBOSS_MATRIX,
      });
    } else if (type === "technicolor") {
      return new fabric.Image.filters.Technicolor();
    } else if (type === "polaroid") {
      return new fabric.Image.filters.Polaroid();
    } else if (type === "blend-color") {
      return new fabric.Image.filters.BlendColor(other);
    } else if (type === "gamma") {
      return new fabric.Image.filters.Gamma(other);
    } else if (type === "kodachrome") {
      return new fabric.Image.filters.Kodachrome();
    } else if (type === "blackwhite") {
      return new fabric.Image.filters.BlackWhite();
    } else if (type === "blend-image") {
      return new fabric.Image.filters.BlendImage(other);
    } else if (type === "huerotation") {
      return new fabric.Image.filters.HueRotation(other);
    } else if (type === "resize") {
      return new fabric.Image.filters.Resize(other);
    } else if (type === "tint") {
      return new fabric.Image.filters.Tint(other);
    } else if (type === "mask") {
      return new fabric.Image.filters.Mask({
        channel: other.channel,
        mask: other.mask,
      });
    } else if (type === "multiply") {
      return new fabric.Image.filters.Multiply({
        color: other.color,
      });
    } else if (type === "sepia2") {
      return new fabric.Image.filters.Sepia2(other);
    }
    return false;
  };

  /**
   * Create filter by types
   * @param {IFilter[]} filters
   */
  createFilters = (filters) => {
    const createdFilters = filters.reduce((prev, filter) => {
      let type = filter?.type || "";
      if (
        type.toLowerCase() === "convolute" &&
        isEqual(filter.matrix, SHARPEN_MATRIX)
      ) {
        type = "sharpen";
      } else if (
        type.toLowerCase() === "convolute" &&
        isEqual(filter.matrix, EMBOSS_MATRIX)
      ) {
        type = "emboss";
      }
      const findIndex = FILTER_TYPES.findIndex(
        (filterType) => type.toLowerCase() === filterType
      );
      if (findIndex > -1) {
        prev[findIndex] = this.createFilter({
          ...filter,
          type,
        });
      }
      return prev;
    }, []);
    return createdFilters;
  };

  /**
   * Apply filter by type
   * @param {string} type
   * @param {*} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyFilterByType = (type, apply = true, value, imageObj) => {
    const obj = imageObj || this.handler.canvas.getActiveObject();
    const findIndex = FILTER_TYPES.findIndex((ft) => ft === type);
    if (obj.filters && findIndex > -1) {
      if (apply) {
        obj.filters[findIndex] = this.createFilter({
          type,
          ...value,
        });
        obj.applyFilters();
      } else {
        obj.filters[findIndex] = false;
        obj.applyFilters();
      }
      this.handler.canvas.requestRenderAll();
      this.handler.set("filters", this.createFilters(obj.filters));
    }
  };

  removeAllAppliedFilters = (imageObj) => {
    const obj = imageObj || this.handler.canvas.getActiveObject();

    if (obj && obj.filters) {
      obj.filters = [];
      obj.applyFilters();
    }

    this.handler.canvas.requestRenderAll();
    this.handler.set("filters", []);
  };

  /**
   * Apply filter in image
   * @param {fabric.Image} [imageObj]
   * @param {number} index
   * @param {fabric.IBaseFilter} filter
   */
  applyFilter = (index, filter, imageObj) => {
    const obj = imageObj || this.handler.canvas.getActiveObject();
    if (obj.filters) {
      obj.filters[index] = filter;
      obj.applyFilters();
      this.handler.canvas.requestRenderAll();
    }
  };

  /**
   * Apply filter value in image
   * @param {fabric.Image} [imageObj]
   * @param {number} index
   * @param {string} prop
   * @param {any} value
   */
  applyFilterValue = (index, prop, value, imageObj) => {
    const obj = imageObj || this.handler.canvas.getActiveObject();
    if (obj.filters) {
      const filter = obj.filters[index];
      if (filter) {
        filter.setOptions({
          [prop]: value,
        });
        obj.applyFilters();
        this.handler.canvas.requestRenderAll();
      }
    }
  };

  /**
   * Apply grayscale in image
   * @param {fabric.Image} [imageObj]
   * @param {boolean} [grayscale=false]
   * @param {GrayscaleModeType} [value]
   */
  applyGrayscale = (grayscale = false, value, imageObj) => {
    this.applyFilter(
      0,
      grayscale &&
        new fabric.Image.filters.Grayscale(
          value
            ? {
                mode: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply invert in image
   * @param {fabric.Image} [imageObj]
   * @param {boolean} [invert=false]
   */
  applyInvert = (invert = false, imageObj) => {
    this.applyFilter(1, invert && new fabric.Image.filters.Invert(), imageObj);
  };

  /**
   * Apply remove color in image
   * @param {fabric.Image} [imageObj]
   * @param {boolean} [removeColor=false]
   * @param {RemoveColorFilter} [value]
   */
  // applyRemoveColor = (removeColor = false, value?: RemoveColorFilter, imageObj) => {
  //     this.applyFilter(2, removeColor && new fabric.Image.filters.RemoveColor(value), imageObj);
  // }

  /**
   * Apply sepia in image
   * @param {fabric.Image} [imageObj]
   * @param {boolean} [sepia=false]
   */
  applySepia = (sepia = false, imageObj) => {
    this.applyFilter(3, sepia && new fabric.Image.filters.Sepia(), imageObj);
  };

  /**
   * Apply brownie in image
   * @param {boolean} [brownie=false]
   * @param {fabric.Image} [imageObj]
   */
  // applyBrownie = (brownie = false, imageObj) => {
  //     this.applyFilter(4, brownie && new fabric.Image.filters.Brownie(), imageObj);
  // }

  /**
   * Apply brightness in image
   * @param {boolean} [brightness=false]
   * @param {number} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyBrightness = (brightness = false, value, imageObj) => {
    this.applyFilter(
      5,
      brightness &&
        new fabric.Image.filters.Brightness(
          value
            ? {
                brightness: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply contrast in image
   * @param {boolean} [contrast=false]
   * @param {number} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyContrast = (contrast = false, value, imageObj) => {
    this.applyFilter(
      6,
      contrast &&
        new fabric.Image.filters.Contrast(
          value
            ? {
                contrast: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply saturation in image
   * @param {boolean} [saturation=false]
   * @param {number} [value]
   * @param {fabric.Image} [imageObj]
   */
  applySaturation = (saturation = false, value, imageObj) => {
    this.applyFilter(
      7,
      saturation &&
        new fabric.Image.filters.Saturation(
          value
            ? {
                saturation: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply noise in image
   * @param {boolean} [noise=false]
   * @param {number} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyNoise = (noise = false, value, imageObj) => {
    this.applyFilter(
      8,
      noise &&
        new fabric.Image.filters.Noise(
          value
            ? {
                noise: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply vintage in image
   * @param {boolean} [vintage=false]
   * @param {fabric.Image} [imageObj]
   */
  // applyVintage = (vintage = false, imageObj) => {
  //     this.applyFilter(9, vintage && new fabric.Image.filters.Vintage(), imageObj);
  // }

  /**
   * Apply pixelate in image
   * @param {boolean} [pixelate=false]
   * @param {number} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyPixelate = (pixelate = false, value, imageObj) => {
    this.applyFilter(
      10,
      pixelate &&
        new fabric.Image.filters.Pixelate(
          value
            ? {
                blocksize: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply blur in image
   * @param {boolean} [blur=false]
   * @param {number} [value]
   * @param {fabric.Image} imageObj
   */
  // applyBlur = (blur = false, value?: number, imageObj) => {
  //     this.applyFilter(11, blur && new fabric.Image.filters.Blur(value ? {
  //         value,
  //     } : undefined), imageObj);
  // }

  /**
   * Apply sharpen in image
   * @param {boolean} [sharpen=false]
   * @param {number[]} [value=[0, -1,  0, -1,  5, -1, 0, -1,  0]]
   * @param {fabric.Image} [imageObj]
   */
  applySharpen = (sharpen = false, value = SHARPEN_MATRIX, imageObj) => {
    this.applyFilter(
      12,
      sharpen &&
        new fabric.Image.filters.Convolute(
          value
            ? {
                matrix: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply emboss in image
   * @param {boolean} [emboss=false]
   * @param {number[]} [value=[1, 1, 1, 1, 0.7, -1, -1, -1, -1]]
   * @param {fabric.Image} [imageObj]
   */
  applyEmboss = (emboss = false, value = EMBOSS_MATRIX, imageObj) => {
    this.applyFilter(
      13,
      emboss &&
        new fabric.Image.filters.Convolute(
          value
            ? {
                matrix: value,
              }
            : undefined
        ),
      imageObj
    );
  };

  /**
   * Apply technicolor in image
   * @param {boolean} [technicolor=false]
   * @param {fabric.Image} [imageObj]
   */
  // applyTechnicolor = (technicolor = false, imageObj) => {
  //     this.applyFilter(14, technicolor && new fabric.Image.filters.Technicolor(), imageObj);
  // }

  /**
   * Apply polaroid in image
   * @param {boolean} [polaroid=false]
   * @param {fabric.Image} [imageObj]
   */
  // applyPolaroid = (polaroid = false, imageObj) => {
  //     this.applyFilter(15, polaroid && new fabric.Image.filters.Polaroid(), imageObj);
  // }

  /**
   * Apply blend color in image
   * @param {boolean} [blend=false]
   * @param {BlendColorFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyBlendColor = (blend = false, value, imageObj) => {
    this.applyFilter(
      16,
      blend && new fabric.Image.filters.BlendColor(value),
      imageObj
    );
  };

  /**
   * Apply gamma in image
   * @param {boolean} [gamma=false]
   * @param {GammaFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  // applyGamma = (gamma = false, value?: GammaFilter, imageObj) => {
  //     this.applyFilter(17, gamma && new fabric.Image.filters.Gamma(value), imageObj);
  // }

  /**
   * Apply kodachrome in image
   * @param {boolean} [kodachrome=false]
   * @param {fabric.Image} [imageObj]
   */
  // applyKodachrome = (kodachrome = false, imageObj) => {
  //     this.applyFilter(18, kodachrome && new fabric.Image.filters.Kodachrome(), imageObj);
  // }

  /**
   * Apply black white in image
   * @param {boolean} [blackWhite=false]
   * @param {fabric.Image} [imageObj]
   */
  // applyBlackWhite = (blackWhite = false, imageObj) => {
  //     this.applyFilter(19, blackWhite && new fabric.Image.filters.BlackWhite(), imageObj);
  // }

  /**
   * Apply blend image in image
   * @param {boolean} [blendImage=false]
   * @param {BlendImageFilter} value
   * @param {fabric.Image} [imageObj]
   */
  applyBlendImage = (blendImage = false, value, imageObj) => {
    this.applyFilter(
      20,
      blendImage && new fabric.Image.filters.BlendImage(value),
      imageObj
    );
  };

  /**
   * Apply hue rotation in image
   * @param {boolean} [hue=false]
   * @param {HueRotationFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  // applyHue = (hue = false, value?: HueRotationFilter, imageObj) => {
  //     this.applyFilter(21, hue && new fabric.Image.filters.HueRotation(value ? {
  //         rotation: value,
  //     } : undefined), imageObj);
  // }

  /**
   * Apply resize in image
   * @param {boolean} [resize=false]
   * @param {ResizeFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyResize = (resize = false, value, imageObj) => {
    this.applyFilter(
      22,
      resize && new fabric.Image.filters.Resize(value),
      imageObj
    );
  };

  /**
   * Apply tint in image
   * @param {boolean} [tint=false]
   * @param {TintFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyTint = (tint = false, value, imageObj) => {
    this.applyFilter(
      23,
      tint && new fabric.Image.filters.Tint(value),
      imageObj
    );
  };

  /**
   * Apply mask in image
   * @param {boolean} [mask=false]
   * @param {MaskFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyMask = (mask = false, value, imageObj) => {
    this.applyFilter(
      24,
      mask && new fabric.Image.filters.Mask(value),
      imageObj
    );
  };

  /**
   * Apply multiply in image
   * @param {boolean} [multiply=false]
   * @param {MultiplyFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyMultiply = (multiply = false, value, imageObj) => {
    this.applyFilter(
      25,
      multiply && new fabric.Image.filters.Multiply(value),
      imageObj
    );
  };

  /**
   * Apply sepia2 in image
   * @param {boolean} [sepia2=false]
   * @param {fabric.Image} [imageObj]
   */
  applySepia2 = (sepia2 = false, imageObj) => {
    this.applyFilter(26, sepia2 && new fabric.Image.filters.Sepia2(), imageObj);
  };

  /**
   * Apply gradient transparency in image
   * @param {boolean} [gradientTransparency=false]
   * @param {GradientTransparencyFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyGradientTransparency = (
    gradientTransparency = false,
    value,
    imageObj
  ) => {
    this.applyFilter(
      27,
      gradientTransparency &&
        new fabric.Image.filters.GradientTransparency(value),
      imageObj
    );
  };

  /**
   * Apply color matrix in image
   * @param {boolean} [colorMatrix=false]
   * @param {ColorMatrixFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyColorMatrix = (colorMatrix = false, value, imageObj) => {
    this.applyFilter(
      28,
      colorMatrix && new fabric.Image.filters.ColorMatrix(value),
      imageObj
    );
  };

  /**
   * Apply remove white in image
   * @param {boolean} [removeWhite=false]
   * @param {RemoveWhiteFilter} [value]
   * @param {fabric.Image} [imageObj]
   */
  applyRemoveWhite = (removeWhite = false, value, imageObj) => {
    this.applyFilter(
      29,
      removeWhite && new fabric.Image.filters.RemoveWhite(value),
      imageObj
    );
  };

  applyImageFilter = (filterOption) => {
    let activeObj = this.handler.canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "image") {
      return;
    }

    let filter = filterOption.filter;

    if (filter === "original") {
      this.removeAllAppliedFilters();
    } else if (
      ["brightness", "contrast", "saturation", "blur"].includes(filter)
    ) {
      this.applyFilterByType(filter, true, {
        [filter]: filterOption.values[0],
      });
    } else if (filter === "huerotation") {
      this.applyFilterByType(filter, true, {
        rotation: filterOption.values[0],
      });
    } else {
      this.applyFilterByType(filter, {
        enabled: true,
        value: filterOption.values[0],
      });
    }
  };

  removeImageFilter = (filterOption) => {
    this.applyFilterByType(filterOption.filter, false);
  };

  replaceImageSource = (imageURL, userProperty = {}, content = null) => {
    let activeObj = this.handler.canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "image") {
      return;
    }
    activeObj.set({
      userProperty: {
        ...activeObj.userProperty,
        ...userProperty,
      },
    });
    this.handler.setImage(activeObj, imageURL, true, true);
    this.handler.canvas.fire("object:modified", {
      target: activeObj,
      message: { content: { ...content } },
    });
    this.handler.canvas.requestRenderAll();
  };
}

export default ImageHandler;
