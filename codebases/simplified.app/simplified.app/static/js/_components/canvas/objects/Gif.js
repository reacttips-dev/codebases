import { fabric } from "fabric";
import { toObject } from "../utils/ObjectUtil";
import "gifler";

const Gif = fabric.util.createClass(fabric.Object, {
  type: "gif",
  superType: "image",
  gifCanvas: null,
  isStarted: false,
  options: {},
  initialize(options) {
    options = options || {};
    this.options = options || {};
    this.callSuper("initialize", options);
    this.gifCanvas = document.createElement("canvas");
  },
  drawFrame(ctx, frame) {
    // update canvas size
    this.gifCanvas.width = frame.width;
    this.gifCanvas.height = frame.height;
    // update canvas that we are using for fabric.js
    ctx.drawImage(
      frame.buffer,
      -frame.width / 2,
      -frame.height / 2,
      frame.width,
      frame.height
    );
  },
  toObject(propertiesToInclude = []) {
    return toObject(this, propertiesToInclude, {
      src: this.get("src"),
      animation: this.get("animation"),
    });
  },
  _render(ctx) {
    this.callSuper("_render", ctx);
    if (!this.isStarted) {
      this.isStarted = true;
      window.gifler(this.options.src).frames(this.gifCanvas, (_c, frame) => {
        this.isStarted = true;
        this.drawFrame(ctx, frame);
      });
    }
  },
});

Gif.fromObject = (options, callback) => {
  return callback(new Gif(options));
};

window.fabric.Gif = Gif;

export default Gif;
