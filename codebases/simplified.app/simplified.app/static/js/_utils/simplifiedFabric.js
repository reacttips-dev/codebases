import { fabric } from "fabric";

//override toObject of fabric.Pattern
var toFixed = fabric.util.toFixed;
fabric.Pattern.prototype.toObject = function (propertiesToInclude) {
  var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,
    source,
    object;
  if (typeof this.source === "function") {
    source = String(this.source);
  } else if (typeof this.source.src === "string") {
    source = this.source.src;
  } else if (typeof this.source === "object" && this.source.toDataURL) {
    source = this.source.src;
    // source = this.source.toDataURL();
  }
  object = {
    type: "pattern",
    source: source,
    // source: this.source.src,
    repeat: this.repeat,
    crossOrigin: this.crossOrigin,
    offsetX: toFixed(this.offsetX, NUM_FRACTION_DIGITS),
    offsetY: toFixed(this.offsetY, NUM_FRACTION_DIGITS),
    patternTransform: this.patternTransform
      ? this.patternTransform.concat()
      : null,
    src: this.src,
  };
  fabric.util.populateWithProperties(this, object, propertiesToInclude);
  return object;
};

fabric.Rect.prototype.toObject = function (propertiesToInclude) {
  let filters = [];

  let properties = {};

  if (this.filters) {
    this.filters.forEach((filterObj) => {
      if (filterObj && filterObj.hasOwnProperty("toObject")) {
        filters.push(filterObj.toObject());
      } else {
        filters.push(filterObj);
      }
    });
    properties = { ...properties, filters: filters };
  }

  if (this.type === "video") {
    // To avoid recurssion from video.js toObject
    properties = {
      ...properties,
      src: this.get("src"),
      file: this.get("file"),
      container: this.get("container"),
      editable: this.get("editable"),
    };
  }

  let object = fabric.util.object.extend(
    this.callSuper("toObject", propertiesToInclude),
    properties
  );

  return object;
};

fabric.Image.prototype.toObject = function (propertiesToInclude) {
  let filters = [];

  if (this.filters) {
    this.filters.forEach((filterObj) => {
      if (filterObj && filterObj.hasOwnProperty("toObject")) {
        filters.push(filterObj.toObject());
      } else {
        filters.push(filterObj);
      }
    });
  }

  var object = fabric.util.object.extend(
    this.callSuper("toObject", ["cropX", "cropY"].concat(propertiesToInclude)),
    {
      src: this.getSrc(),
      crossOrigin: this.getCrossOrigin(),
      filters: filters,
    }
  );
  if (this.resizeFilter) {
    object.resizeFilter = this.resizeFilter.toObject();
  }
  return object;
};

fabric.Object.prototype.strokeUniform = true;
fabric.Object.prototype.noScaleCache = false;
