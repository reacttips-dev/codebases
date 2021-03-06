import React from "react";
import ReactDOM from "react-dom";
import App from "./TldrApp/App";
import "./index.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faSearch,
  faSlidersH,
  faChevronCircleLeft,
  faChevronCircleRight,
  faAngleLeft,
  faEdit,
  faCloudUploadAlt,
  faPlus,
  faBriefcase,
  faClock,
  faFolder,
  faFolderPlus,
  faEgg,
  faPuzzlePiece,
  faUsers,
  faArchive,
  faPencilAlt,
  faCopy,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faUserCircle,
  faTrash,
  faCog,
  faTimes,
  faFillDrip,
  faPaintRoller,
  faTextHeight,
  faTextWidth,
  faImage,
  faChevronLeft,
  faPlusCircle,
  faEllipsisH,
  faHighlighter,
  faPalette,
  faHeart,
  faPlayCircle,
  faAngleDown,
  faAngleUp,
  faAngleRight,
  faMagic,
  faExpandArrowsAlt,
  faHome,
  faTable,
  faScroll,
  faArrowCircleRight,
  faArrowAltCircleUp,
  faCheckCircle,
  faVectorSquare,
  faLayerGroup,
  faShapes,
  faUndo,
  faRedo,
  faMousePointer,
  faCheck,
  faArrowLeft,
  faAt,
  faVideo,
  faSquare,
  faEyeDropper,
  faChevronDown,
  faPlay,
  faAdjust,
  faChevronUp,
  faHandRock,
  faLock,
  faUnlock,
  faFileDownload,
  faPause,
  faStop,
  faShare,
  faReply,
  faArrowRight,
  faBolt,
  faGripLinesVertical,
  faVolumeUp,
  faVolumeMute,
  faEllipsisV,
  faEye,
  faShareAlt,
  faUserPlus,
  faArrowsAltV,
  faArrowsAltH,
  faExchangeAlt,
  faFont,
  faIcons,
  faKeyboard,
  faQuestionCircle,
  faHeading,
  faFileUpload,
  faThLarge,
  faCircle,
  faCaretLeft,
  faCaretUp,
  faCaretRight,
  faCaretDown,
  faCropAlt,
  faFlag,
  faSave,
  faRobot,
  faAd,
  faChevronRight,
  faHashtag,
  faInfoCircle,
  faTimesCircle,
  faHourglassEnd,
  faFrown,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  fab,
  faSearch,
  faSlidersH,
  faChevronCircleLeft,
  faChevronCircleRight,
  faAngleLeft,
  faPencilAlt,
  faCloudUploadAlt,
  faPlus,
  faBriefcase,
  faClock,
  faFolder,
  faFolderPlus,
  faEgg,
  faPuzzlePiece,
  faUsers,
  faArchive,
  faEdit,
  faCopy,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faUserCircle,
  faTrash,
  faCog,
  faTimes,
  faFillDrip,
  faPaintRoller,
  faTextHeight,
  faTextWidth,
  faImage,
  faChevronLeft,
  faChevronRight,
  faPlusCircle,
  faEllipsisH,
  faHighlighter,
  faPalette,
  faHeart,
  faPlayCircle,
  faAngleLeft,
  faAngleDown,
  faAngleRight,
  faMagic,
  faAngleUp,
  faExpandArrowsAlt,
  faHome,
  faTable,
  faScroll,
  faArrowCircleRight,
  faArrowAltCircleUp,
  faCheckCircle,
  faVectorSquare,
  faLayerGroup,
  faShapes,
  faUndo,
  faRedo,
  faMousePointer,
  faCheck,
  faArrowLeft,
  faAt,
  faVideo,
  faSquare,
  faEyeDropper,
  faChevronDown,
  faPlay,
  faAdjust,
  faChevronUp,
  faHandRock,
  faLock,
  faUnlock,
  faFileDownload,
  faPause,
  faStop,
  faShare,
  faReply,
  faArrowRight,
  faBolt,
  faGripLinesVertical,
  faVolumeUp,
  faVolumeMute,
  faEllipsisV,
  faEye,
  faShareAlt,
  faUserPlus,
  faArrowsAltV,
  faArrowsAltH,
  faExchangeAlt,
  faFont,
  faIcons,
  faKeyboard,
  faQuestionCircle,
  faHeading,
  faFileUpload,
  faThLarge,
  faCircle,
  faCaretLeft,
  faCaretUp,
  faCaretRight,
  faCaretDown,
  faCropAlt,
  faFlag,
  faSave,
  faRobot,
  faAd,
  faHashtag,
  faInfoCircle,
  faTimesCircle,
  faHourglassEnd,
  faFrown
);

ReactDOM.render(<App />, document.getElementById("root"));
