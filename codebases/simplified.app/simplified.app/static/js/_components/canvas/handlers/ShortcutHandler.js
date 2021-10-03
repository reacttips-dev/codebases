import { ARROWS } from "../../../_utils/constants";

export default class ShortcutHandler {
  constructor(handler) {
    this.handler = handler;
    this.initialize();
  }

  initialize = () => {};

  // delete layer/activeSelection/page
  isDelete = (e) => {
    return e.keyCode === 46 || e.keyCode === 127 || e.keyCode === 8;
  };

  // copy
  isCtrlC = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 67;
  };

  // paste
  isCtrlV = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 86;
  };

  // undo
  isCtrlZ = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 90;
  };

  // redo
  isCtrlY = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 89;
  };

  // zoom in
  isPlus = (e) => {
    return e.keyCode === 187 || e.keyCode === 107;
  };

  // zoom out
  isMinus = (e) => {
    return e.keyCode === 189 || e.keyCode === 109;
  };

  // zoom 1:1
  isO = (e) => {
    return e.keyCode === 79;
  };

  // zoom fit
  isP = (e) => {
    return e.keyCode === 80;
  };

  // show/hide global search
  isCtrlK = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 75;
  };

  // clone layer/activeSelection
  isCtrlD = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 68;
  };

  // group
  isCtrlG = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 71;
  };

  // ungroup
  isCtrlShiftG = (e) => {
    return (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 71;
  };

  // export
  isCtrlShiftE = (e) => {
    return (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 69;
  };

  // select top layer
  isAltPeriod = (e) => {
    return (e.altKey || e.keyCode === 18) && e.keyCode === 190;
  };

  // select bottom layer
  isAltComma = (e) => {
    return (e.altKey || e.keyCode === 18) && e.keyCode === 188;
  };

  // bold
  isCtrlB = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 66;
  };

  // italic
  isCtrlI = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 73;
  };

  // underline
  isCtrlU = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 85;
  };

  // strikethrough
  isCtrlShiftX = (e) => {
    return (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 88;
  };

  // lock layer
  isCtrlShiftL = (e) => {
    return (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 76;
  };

  // moving layer
  isArrow = (e) => {
    return ARROWS.includes(e?.keyCode);
  };

  // open text/components/images/visuals/media panel
  isT = (e) => {
    return e.keyCode === 84;
  };

  isC = (e) => {
    return e.keyCode === 67;
  };

  isI = (e) => {
    return e.keyCode === 73;
  };

  isV = (e) => {
    return e.keyCode === 86;
  };

  isM = (e) => {
    return e.keyCode === 77;
  };

  isCtrlForwardSlash = (e) => {
    return (e.ctrlKey || e.metaKey) && e.keyCode === 191;
  };
}
