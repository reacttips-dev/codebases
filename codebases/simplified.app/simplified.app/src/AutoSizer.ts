import { addEvent, removeEvent, innerWidth, innerHeight, getAttribute } from "./utils";
import { WIDTH, HEIGHT } from "./consts";
import { AutoSizerElement } from "./types";

const elements: AutoSizerElement[] = [];

export function add(element: AutoSizerElement, prefix: string) {
  !elements.length && addEvent(window, "resize", resizeAll);
  element.__PREFIX__ = prefix;
  elements.push(element);
  resize(element);
}
export function remove(element: AutoSizerElement, prefix: string) {
  const index = elements.indexOf(element);

  if (index < 0) {
    return;
  }
  const fixed = getAttribute(element, `${prefix}fixed`);

  delete element.__PREFIX__;
  element.style[fixed === HEIGHT ? WIDTH : HEIGHT] = "";
  elements.splice(index, 1);
  !elements.length && removeEvent(window, "resize", resizeAll);
}
function resize(element: AutoSizerElement, prefix = "data-") {
  let elementPrefix = element.__PREFIX__;

  if (typeof elementPrefix !== "string") {
    elementPrefix = prefix;
  }
  const dataWidth = parseInt(getAttribute(element, `${elementPrefix}${WIDTH}`), 10) || 0;
  const dataHeight = parseInt(getAttribute(element, `${elementPrefix}${HEIGHT}`), 10) || 0;
  const fixed = getAttribute(element, `${elementPrefix}fixed`);

  if (fixed === HEIGHT) {
    const size = innerHeight(element) || dataHeight;

    element.style[WIDTH] = `${dataWidth / dataHeight * size}px`;
  } else {
    const size = innerWidth(element) || dataWidth;

    element.style[HEIGHT] = `${dataHeight / dataWidth * size}px`;
  }
}
export function resizeAll() {
  elements.forEach(element => {
    resize(element);
  });
}
