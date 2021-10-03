import { fabric } from "fabric";
import Svg from "./objects/Svg";
import Gif from "./objects/Gif";
import Video from "./objects/Video";
import PhotoText from "./objects/PhotoText";

const CanvasObject = {
  group: {
    create: ({ objects, ...option }) => new fabric.Group(objects, option),
  },
  textbox: {
    create: ({ text, ...option }) => new fabric.Textbox(text, option),
  },
  "i-text": {
    create: ({ text, ...option }) => new fabric.IText(text, option),
  },
  image: {
    create: ({ element = new Image(), ...option }) =>
      new fabric.Image(element, {
        ...option,
        crossOrigin: "anonymous",
      }),
  },
  svg: {
    create: (option) => new Svg(option),
  },
  video: {
    create: ({ src, file, ...option }) => new Video(src || file, option),
  },
  gif: {
    create: (option) => new Gif(option),
  },
  triangle: {
    create: (option) => new fabric.Triangle(option),
  },
  circle: {
    create: (option) => new fabric.Circle(option),
  },
  rect: {
    create: (option) => new fabric.Rect(option),
  },
  ellipse: {
    create: (option) => new fabric.Ellipse(option),
  },
  polygon: {
    create: ({ points, ...option }) =>
      new fabric.Polygon(points, { ...option }),
  },
  "photo-text": {
    create: ({ text, ...option }) => new PhotoText(text, option),
  },
};

export default CanvasObject;
