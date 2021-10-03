import { GridLayout } from "@egjs/react-infinitegrid";
import { css } from "@emotion/react";
import { faGoogleDrive, faShopify } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowLeft,
  faArrowRight,
  faArrowsAlt,
  faCheck,
  faExpandArrowsAlt,
  faSync,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import {
  Badge,
  Button,
  Modal,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { DragPreviewImage, useDrag, useDrop } from "react-dnd";
import Loader from "react-loader";
import { ReactComponent as BrandIcon } from "../../assets/logo/smp-s.svg";
//import { ReactComponent as BrandTextIcon } from "../../assets/logo/smp-logo-with-text.svg";
import { ReactComponent as BrandTextIcon } from "../../assets/logo/white-smp-logo-with-text.svg";
import ArtBoardPreviewStaticCanvas from "../../TldrStoryDetail/ArtBoardPreviewStaticCanvas";
import { ImageSources, ItemTypes } from "../../_actions/types";
import {
  formatDuration,
  formatSelectedDuration,
  getImageProviderErrorsData,
  getSourceCreditInfoData,
} from "../../_utils/common";
import { MY_APPS } from "../../_utils/routes";
import EditableLabel from "../common/EditableLabel";
import {
  StyledArtBoardPreviewContainer,
  StyledArtboardPreviewDuration,
  StyledArtBoardPreviewStaticCanvasWrapper,
  StyledArtBoardPreviewTitle,
  StyledArtBoardRearrangeContainer,
  StyledTooltipWithKBDShortcut,
} from "../styled/details/styleArtBoardEditor";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
  StyledAnimationPlaybackActionButton,
  StyledArrangeActionButton,
  StyledCroppingElement,
  StyledCustomStoryActions,
  StyledCustomStorySizeIcon,
  StyledElementHandle,
  StyledGalleryTypeHeader,
  StyledGalleryTypeHeaderActionMore,
  StyledGalleryTypeHeaderTitle,
  StyledGradientAngleRow,
  StyledSetAsBackgroundHandle,
  StyledShapeColorsCustomActionButton,
  StyledTextEditorActionButton,
  StyledTextEditorCustomActionButton,
  StyledActionOnSection,
} from "../styled/details/stylesDetails";
import {
  StyledButton,
  StyledContentOverlay,
  StyledVideoDurationContainer,
  StyledLoginFormField,
  StyledSaveAsTemplateTextBlock,
} from "../styled/styles";
import { primary } from "../styled/variable";
import storyCardPlaceHolder from "./../../assets/images/storyCard/storyCardPlaceHolder.png";
import ImageItemActions from "./ImageItemActions";
import SourceCreditInfo from "./SourceCreditInfo";
import TemplateItemActions from "./TemplateItemActions";
import TLDRImage from "./TLDRImage";
import TldrSidebarCloseAnchor from "./TldrSidebarCloseAnchor";
import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import TLDRSwiperImage from "./TLDRSwiperImage";
import { StyledTldrBadgeWrapper } from "../styled/details/styleAdvancedPanel";
import { Image } from "react-shimmer";

dayjs.extend(duration);

export const initialNavBarFilterState = {
  title: "All",
  id: -1,
  description: "",
};

export const BrandLogo = ({ width, height }) => {
  const logoWidth = width != null ? width : 35;
  const logoHeight = width != null ? height : 35;
  return (
    <>
      {/* Brand Logo */}

      <BrandIcon
        style={{ cursor: "pointer" }}
        className="d-inline-block align-top"
        width={logoWidth}
        height={logoHeight}
      />
    </>
  );
};

export const BrandTextLogo = ({ width, height }) => {
  const logoWidth = width != null ? width : 35;
  const logoHeight = width != null ? height : 35;
  return (
    <>
      {/* Brand Logo */}

      <BrandTextIcon
        style={{ cursor: "pointer" }}
        className="d-inline-block align-top"
        width={logoWidth}
        height={logoHeight}
      />
    </>
  );
};

export const InfiniteGridLayout = ({ childElements, loaded }) => (
  <GridLayout
    className="gridlayout gridlayout-container"
    loading={<ShowCenterSpinner loaded={loaded} />}
    options={{
      isOverflowScroll: false,
      useFit: true,
      useRecycle: true,
      horizontal: false,
    }}
    layoutOptions={{
      margin: 15,
      align: "center",
    }}
    onLayoutComplete={(e) => {
      !e.isLayout && e.endLoading();
    }}
  >
    {childElements}
  </GridLayout>
);

export const ToolTipWrapper = (props) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={props.id}>{props.tooltip}</Tooltip>}
    >
      {props.children}
    </OverlayTrigger>
  );
};

export const TextItem = (props) => {
  const [, drag] = useDrag({
    item: {
      type: ItemTypes.CARD,
      payload: props.data,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div className={props.className} onClick={() => props.onClick()} ref={drag}>
      {props.children}
    </div>
  );
};

export const ImageItem = (props) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ItemTypes.CARD,
      payload: props.data,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const {
    source,
    hasAction,
    itemWidth,
    showOverlayInfo,
    type,
    modalFor,
    index,
    isUsedInSwiper,
  } = props;
  let creditInfo = null;
  const { meta } = props.data.content || { meta: {} };
  if (source !== null) {
    let sourceCreditInfoData = getSourceCreditInfoData(source, props, meta);
    if (meta) {
      creditInfo = (
        <SourceCreditInfo
          authorName={sourceCreditInfoData.authorName}
          authorLink={sourceCreditInfoData.authorLink}
          sourceSiteName={sourceCreditInfoData.sourceSiteName}
          sourceSiteLink={sourceCreditInfoData.sourceSiteLink}
          isDragging={isDragging}
        />
      );
    }
  }

  return (
    <>
      {props.url && <DragPreviewImage connect={preview} src={props.url} />}
      <div className="thumbnail" ref={drag}>
        {showOverlayInfo !== false ? (
          <StyledContentOverlay
            className={"content-overlay"}
            isDragging={isDragging}
          />
        ) : (
          <></>
        )}
        {isUsedInSwiper ? (
          <TLDRSwiperImage
            src={props.url}
            width={itemWidth || 152.5}
            height={
              ((itemWidth || 152.5) * parseInt(props.height)) /
              parseInt(props.width)
            }
          />
        ) : (
          <TLDRImage
            NativeImgProps={{ style: { opacity: isDragging ? 0.5 : 1 } }}
            src={props.url}
            alt={props.alt}
            width={itemWidth || 152.5}
            height={
              ((itemWidth || 152.5) * parseInt(props.height)) /
              parseInt(props.width)
            }
            data-width={itemWidth || 152.5}
            data-height={
              ((itemWidth || 152.5) * parseInt(props.height)) /
              parseInt(props.width)
            }
          />
        )}
        {props.data.mime === "video" && (
          <StyledVideoDurationContainer>
            <Duration
              type="video_duration"
              seconds={meta.duration ? meta.duration : meta.payload?.duration}
            />
          </StyledVideoDurationContainer>
        )}
        {showOverlayInfo !== false ? creditInfo : <></>}
        {hasAction && (
          <>
            {modalFor === "template" ? (
              <TemplateItemActions
                id={meta.id}
                title={meta.title}
                index={index}
                type={type}
                modalFor={modalFor}
              />
            ) : (
              <ImageItemActions id={meta.id} type={type} modalFor={modalFor} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export const ImageItemWithoutDrag = (props) => {
  const { source, hasAction, itemWidth, showOverlayInfo, type, modalFor } =
    props;
  let creditInfo = null;
  const { meta } = props.data.content || { meta: {} };

  if (source !== null) {
    let sourceCreditInfoData = getSourceCreditInfoData(source, props, meta);
    if (meta) {
      creditInfo = (
        <SourceCreditInfo
          authorName={sourceCreditInfoData.authorName}
          authorLink={sourceCreditInfoData.authorLink}
          sourceSiteName={sourceCreditInfoData.sourceSiteName}
          sourceSiteLink={sourceCreditInfoData.sourceSiteLink}
        />
      );
    }
  }

  return (
    <>
      <div className="thumbnail">
        <TLDRImage
          NativeImgProps={{ style: { opacity: 1 } }}
          src={props.url}
          alt={props.alt}
          width={"100%"}
          height={"100%"}
          data-width={itemWidth || 152.5}
          data-height={
            ((itemWidth || 152.5) * parseInt(props.height)) /
            parseInt(props.width)
          }
        />
        {props.data.mime === "video" && (
          <StyledVideoDurationContainer>
            <Duration
              type="video_duration"
              seconds={
                meta?.duration ? meta.duration : meta?.payload?.duration || 0
              }
            />
          </StyledVideoDurationContainer>
        )}
        {showOverlayInfo !== false ? creditInfo : <></>}
        {hasAction && (
          <ImageItemActions id={meta.id} type={type} modalFor={modalFor} />
        )}
      </div>
    </>
  );
};

export const ProductImageItem = (props) => {
  const { source, itemWidth } = props;
  let creditInfo = null;
  const { meta } = props.data.content || { meta: {} };

  if (source !== null) {
    let sourceCreditInfoData = getSourceCreditInfoData(source, props, meta);
    if (meta) {
      creditInfo = (
        <SourceCreditInfo
          authorName={sourceCreditInfoData.authorName}
          authorLink={sourceCreditInfoData.authorLink}
          sourceSiteName={sourceCreditInfoData.sourceSiteName}
          sourceSiteLink={sourceCreditInfoData.sourceSiteLink}
        />
      );
    }
  }

  return (
    <>
      <div className="thumbnail">
        <TLDRImage
          src={props.url}
          alt={props.alt}
          width={itemWidth || 152.5}
          height={
            ((itemWidth || 152.5) * parseInt(props.height)) /
            parseInt(props.width)
          }
          data-width={itemWidth || 152.5}
          data-height={
            ((itemWidth || 152.5) * parseInt(props.height)) /
            parseInt(props.width)
          }
        />
      </div>
    </>
  );
};

export const SimpleImageItem = (props) => {
  return (
    <div className="thumbnail text-effect-thumbnail">
      <Image
        src={props.url}
        // className="item"
        alt={props.alt}
        width={268}
        height={(268 * parseInt(props.height)) / parseInt(props.width)}
        color="rgba(255, 255, 255, 0.12)"
        duration={1000}
      />
    </div>
  );
};

export const VideoItem = ({ url }) => (
  <div className="item">
    <div className="thumbnail">
      <video src={url} />
    </div>
  </div>
);

export const overrideCSSForSpinner = css`
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-color: red;
  align-items: center;
  size: 64;
  sizeunit: "px";
`;

export const overrideCSSForCenterSpinner = css`
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
`;


export const ShowCenterSpinner = ({ loaded, className }) => {
  let options = {
    lines: 8,
    length: 0,
    width: 10,
    radius: 18,
    scale: 1.0,
    corners: 1,
    color: "#ffac41",
    opacity: 0.25,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 60,
    fps: 20,
    zIndex: 2e9,
    top: "50%",
    left: "50%",
    shadow: false,
    hwaccel: false,
    position: "absolute",
  };
  return (
    <Loader
      loaded={loaded}
      options={options}
      className={className + " spinner"}
    />
  );
};

export const SidebarPanel = ({ childComp }) => {
  return (
    <>
      <section
        className={
          "tldr-main-sidebar-item-detail-slider tldr-main-sidebar-item-detail-slider-" +
          "open"
        }
      >
        <div className="panel-container">
          <TldrSidebarCloseAnchor />
          {childComp}
        </div>
      </section>
    </>
  );
};

export const StoryAction = ({
  action,
  id,
  tooltip,
  icon,
  url,
  clickHandler,
  label,
}) => {
  return (
    <OverlayTrigger
      key={id}
      placement="top"
      overlay={<Tooltip id={`tooltip-${id}`}>{tooltip}</Tooltip>}
    >
      <div
        className="action"
        onClick={(e) => {
          e.stopPropagation();
          clickHandler(action, id);
        }}
        style={{ cursor: "pointer" }}
      >
        <FontAwesomeIcon
          icon={icon}
          size="1x"
          className="mr-1"
        ></FontAwesomeIcon>
        {label}
      </div>
    </OverlayTrigger>
  );
};

export const MarketplaceTemplatesAction = ({
  action,
  id,
  tooltip,
  icon,
  url,
  clickHandler,
  label,
}) => {
  return (
    <OverlayTrigger
      key={id}
      placement="top"
      overlay={<Tooltip id={`tooltip-${id}`}>{tooltip}</Tooltip>}
    >
      <>
        <div
          className="action"
          onClick={(e) => {
            e.stopPropagation();
            clickHandler(action, id);
          }}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon
            icon={icon}
            size="2x"
            className="mr-1"
          ></FontAwesomeIcon>
        </div>
        <span>{label}</span>
      </>
    </OverlayTrigger>
  );
};

export const ShowNoContent = ({ text }) => {
  return <div className="no-content avoid-capturing">{text}</div>;
};

export const RequestTemplateContent = ({ text }) => {
  return (
    <div className="no-content avoid-capturing">
      {text}.
      <a
        target="_blank"
        rel="noreferrer"
        href="https://simplified.feedbear.com/boards/templates"
      >
        Click here
      </a>{" "}
      to request.
    </div>
  );
};

export const ShowNoObject = ({ text }) => {
  return <div className="no-object avoid-capturing">{text}</div>;
};

export const ShowBrandKitInfo = ({ text }) => {
  return <div className="no-brandkit-content avoid-capturing">{text}</div>;
};

export const ImageSourceIcon = ({ imageSource }) => {
  switch (imageSource) {
    case ImageSources.GOOGLE_DRIVE:
      return (
        <FontAwesomeIcon
          className="partner-logo-shopify no-shopify-content-icon"
          icon={faGoogleDrive}
          size="4x"
        ></FontAwesomeIcon>
      );
    case ImageSources.SHOPIFY:
      return (
        <FontAwesomeIcon
          className="partner-logo-shopify no-shopify-content-icon"
          icon={faShopify}
          size="4x"
        ></FontAwesomeIcon>
      );
    default:
      return null;
  }
};

export const ImageProvierErrorsInfo = ({
  imageProviderErrors,
  imageSource,
}) => {
  const errorsData = getImageProviderErrorsData(
    imageSource,
    imageProviderErrors
  );
  const { actionText, errorsText } = errorsData;

  return (
    <>
      <div className="no-shopify-content">
        {errorsText &&
          errorsText.map((error, idx) => <span key={idx}>{error}</span>)}
        <ImageSourceIcon imageSource={imageSource} />
        <StyledButton
          className="no-shopify-content-button"
          tldrbtn="primary"
          onClick={() => window.open(MY_APPS, "_blank")}
        >
          {actionText}
        </StyledButton>
      </div>
    </>
  );
};

export const MoveElementsHandle = ({ className, style }) => {
  return (
    <StyledElementHandle className={className} style={style}>
      <FontAwesomeIcon
        icon={faArrowsAlt}
        size="xs"
        color={primary}
      ></FontAwesomeIcon>
    </StyledElementHandle>
  );
};

export const ApplyCropOnImage = ({ className, style, onClick }) => {
  return (
    <StyledCroppingElement
      className={className}
      style={style}
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faCheck}
        size="xs"
        color={primary}
      ></FontAwesomeIcon>
    </StyledCroppingElement>
  );
};

export const CancelImageCrop = ({ className, style, onClick }) => {
  return (
    <StyledCroppingElement
      className={className}
      style={style}
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faTimes}
        size="xs"
        color={primary}
      ></FontAwesomeIcon>
    </StyledCroppingElement>
  );
};

export const RotateElementsHandle = ({ className, style }) => {
  return (
    <StyledElementHandle className={className} style={style}>
      <FontAwesomeIcon
        icon={faSync}
        size="xs"
        color={primary}
      ></FontAwesomeIcon>
    </StyledElementHandle>
  );
};

export const SetAsBackgroundHandle = ({
  className,
  style,
  setAsBackground,
  scale,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={"background"}>{"Set as background"}</Tooltip>}
    >
      <StyledSetAsBackgroundHandle
        className={className}
        style={style}
        onClick={setAsBackground}
        scale={scale}
      >
        <FontAwesomeIcon
          icon={faExpandArrowsAlt}
          size="xs"
          color={primary}
        ></FontAwesomeIcon>
      </StyledSetAsBackgroundHandle>
    </OverlayTrigger>
  );
};

export const TldrConfirmationModal = (props) => {
  const { show, onHide, inprogress, modalFor, customMessage } = props;

  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title>
          {customMessage
            ? customMessage
            : "Are you sure you want to delete this " + modalFor + "?"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>You won't be able to recover it.</Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onHide();
          }}
          variant="outline-warning"
          disabled={inprogress === "true" ? true : false}
        >
          No
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onYes();
          }}
          variant="warning"
        >
          {inprogress === "true" && (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="sr-only">Deleting...</span>
            </>
          )}
          {props.inprogress === "false" && "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TldrBasicConfirmationModal = (props) => {
  const { show, onHide, inprogress, title, message } = props;
  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onHide();
          }}
          variant="outline-warning"
          disabled={inprogress}
        >
          No
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onYes();
          }}
          variant="warning"
        >
          {inprogress && (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="sr-only">Please wait..</span>
            </>
          )}
          {!props.inprogress && "Yes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TldrProgressDialog = (props) => {
  const { show, onHide } = props;
  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title>Cloning it now.</Modal.Title>
      </Modal.Header>
      <Modal.Body>Hang in tight, cloning all the assets, styles.</Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <Button variant="warning">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="sr-only">Cloning...</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TldrUnlockWarningDialog = (props) => {
  const { show, onHide, inprogress } = props;
  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title>{"Unlock layer"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{"Are you sure you want to unlock this layer?"}</Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onHide();
          }}
          variant="outline-warning"
          disabled={inprogress === "true" ? true : false}
        >
          No
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onYes();
          }}
          variant="warning"
        >
          Unlock Now.
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TldrConfirmActionModal = (props) => {
  const { show, onHide, inprogress } = props;
  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title>{"Delete Artboard"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {"Are you sure you want to delete this artboard?"}
      </Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onHide();
          }}
          variant="outline-warning"
          disabled={inprogress === "true" ? true : false}
        >
          No
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onYes();
          }}
          variant="warning"
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TldrCustomSidebarIconAction = ({
  action,
  icon,
  title,
  callback,
  disabled,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={title}>{title}</Tooltip>}
    >
      <StyledTextEditorCustomActionButton
        disabled={disabled}
        onClick={(e) => callback(action)}
      >
        {icon}
      </StyledTextEditorCustomActionButton>
    </OverlayTrigger>
  );
};

export const TldrCustomToolbarIconAction = ({
  action,
  icon,
  title,
  callback,
}) => {
  return (
    <StyledArrangeActionButton onClick={(e) => callback(action)}>
      <StyledTextEditorCustomActionButton className="mr-2">
        {icon}
      </StyledTextEditorCustomActionButton>
      {title}
    </StyledArrangeActionButton>
  );
};

export const TldrCustomShapeColorAction = ({ color, callback, isSelected }) => {
  var backgroundColor;
  if (
    typeof color === "string" &&
    (color.startsWith("rgba") || color.startsWith("#"))
  ) {
    backgroundColor = color;
  } else {
    backgroundColor = "transparent";
  }
  return (
    <StyledShapeColorsCustomActionButton
      bgColor={backgroundColor}
      onClick={(e) => callback()}
      isSelected={isSelected}
    ></StyledShapeColorsCustomActionButton>
  );
};

export const TldrCollapsableAction = ({
  action,
  icon,
  title,
  callback,
  disabled,
  hidden,
  iconColor,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={icon}>{title}</Tooltip>}
    >
      <StyledActionOnSection
        onClick={(e) => callback(action)}
        disabled={disabled}
        hidden={hidden}
      >
        <FontAwesomeIcon
          icon={icon}
          color={!disabled && iconColor}
        ></FontAwesomeIcon>
      </StyledActionOnSection>
    </OverlayTrigger>
  );
};

export const TldrAction = ({
  action,
  icon,
  title,
  callback,
  className,
  disabled,
  hidden,
  userAction,
  shortcutKeys,
  inProgress,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id={icon}>
          <StyledTooltipWithKBDShortcut>
            {title}
            {shortcutKeys && (
              <div className="hotkeys">
                <kbd>{shortcutKeys[0]}</kbd>{" "}
                {shortcutKeys[1] && <kbd>{shortcutKeys[1]}</kbd>}{" "}
                {shortcutKeys[2] && <kbd>{shortcutKeys[2]}</kbd>}
              </div>
            )}
          </StyledTooltipWithKBDShortcut>
        </Tooltip>
      }
    >
      <StyledTextEditorCustomActionButton
        className={className ? className : ""}
        onClick={(e) => callback(action, userAction)}
        disabled={disabled}
        hidden={hidden}
      >
        {inProgress ? (
          <Spinner
            variant="warning"
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          <FontAwesomeIcon className="fa-16" icon={icon}></FontAwesomeIcon>
        )}
      </StyledTextEditorCustomActionButton>
    </OverlayTrigger>
  );
};

export const TldrCustomIconAction = ({
  action,
  icon,
  title,
  callback,
  className,
  disabled,
  hidden,
  userAction,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={icon}>{title}</Tooltip>}
    >
      <StyledTextEditorCustomActionButton
        className={className ? className : ""}
        onClick={(e) => callback(action, userAction)}
        disabled={disabled}
        hidden={hidden}
      >
        {icon}
      </StyledTextEditorCustomActionButton>
    </OverlayTrigger>
  );
};

export const TldrEditorAction = ({
  action,
  icon,
  title,
  callback,
  active,
  disabled,
  shortcutKeys,
  showHover,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id={icon.iconName || title}>
          <StyledTooltipWithKBDShortcut>
            {title}
            {shortcutKeys && (
              <div className="hotkeys">
                <kbd>{shortcutKeys[0]}</kbd> <kbd>{shortcutKeys[1]}</kbd>{" "}
                {shortcutKeys[2] && <kbd>{shortcutKeys[2]}</kbd>}
              </div>
            )}
          </StyledTooltipWithKBDShortcut>
        </Tooltip>
      }
    >
      <StyledTextEditorActionButton
        onClick={(e) => callback(action)}
        className={active && "active"}
        disabled={disabled || false}
        showHover={showHover}
      >
        {!icon.iconName ? (
          icon
        ) : (
          <FontAwesomeIcon className="fa-light" icon={icon}></FontAwesomeIcon>
        )}
      </StyledTextEditorActionButton>
    </OverlayTrigger>
  );
};

export const TldrAnimationPlaybackAction = ({
  action,
  icon,
  title,
  callback,
  className,
  disabled,
  margin,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={icon}>{title}</Tooltip>}
    >
      <StyledAnimationPlaybackActionButton
        className={className ? className : ""}
        onClick={(e) => callback(action)}
        disabled={disabled}
        margin={margin}
      >
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      </StyledAnimationPlaybackActionButton>
    </OverlayTrigger>
  );
};

export const TldrNavbarButton = ({
  action,
  icon,
  title,
  callback,
  className,
}) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id={icon}>{title}</Tooltip>}
    >
      <StyledTextEditorCustomActionButton
        className={className ? className : ""}
        onClick={(e) => callback(action)}
      >
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
      </StyledTextEditorCustomActionButton>
    </OverlayTrigger>
  );
};

export const Dropable = (props) => {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      props.onDrop(item.payload);
      return { moved: true };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  return (
    <div
      ref={drop}
      style={{
        width: `100%`,
        height: `100%`,
      }}
      className={props.className}
    >
      {props.children}
    </div>
  );
};

export const CollapsibleSection = ({
  toggleSection,
  show,
  sectionTitle,
  showComponent,
  changeIcon,
}) => {
  return (
    <div
      id="accordion"
      style={{ boxShadow: "8px 0 16px 0 rgba(0, 0, 0, 0.5)" }}
    >
      <div className="card" style={{ backgroundColor: "#323232" }}>
        <div
          className="card-header"
          onClick={toggleSection}
          style={{ backgroundColor: "#292828" }}
        >
          <a
            className="card-link"
            onClick={toggleSection}
            href="#collapseOne"
            style={{ color: "#FFAC41" }}
          >
            {sectionTitle}{" "}
            <FontAwesomeIcon
              icon={show !== "" ? "angle-down" : "angle-right"}
            />
          </a>{" "}
        </div>
        <div
          id="collapseOne"
          className={"collapse collapsible-sections " + show}
          data-parent="#accordion"
        >
          <div className="card-body">{showComponent}</div>
        </div>
      </div>
    </div>
  );
};

export function Handle({ handle: { id, value, percent }, getHandleProps }) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#2C4870",
        color: "#333",
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontFamily: "Roboto", fontSize: 11, marginTop: -35 }}>
        {value}
      </div>
    </div>
  );
}
export const StoryCardPlaceHolder = ({ height, width }) => {
  return (
    <img
      src={storyCardPlaceHolder}
      alt="story card placeholder"
      height={height}
      width={width}
    ></img>
  );
};

export const GalleryTypeHeaderTitle = ({ title, moreOpened, toggleMore }) => {
  return (
    <StyledGalleryTypeHeader>
      {moreOpened && (
        <StyledGalleryTypeHeaderActionMore
          style={{ marginRight: "1rem" }}
          icon={faArrowLeft}
          onClick={toggleMore}
        />
      )}
      <StyledGalleryTypeHeaderTitle>{title}</StyledGalleryTypeHeaderTitle>
      {!moreOpened && (
        <div
          className="all"
          onClick={toggleMore}
          style={{ marginLeft: "auto" }}
        >
          <span>View all</span>
          <FontAwesomeIcon icon={faArrowRight} size="1x"></FontAwesomeIcon>
        </div>
      )}
    </StyledGalleryTypeHeader>
  );
};

export const TldrCreateComponentModal = (props) => {
  const { show, onHide, inprogress } = props;
  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <Modal.Header>
        <Modal.Title>
          {inprogress ? "Creating a new component." : "Save as component"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {inprogress
          ? "Hang in tight, creating a new component."
          : "Create component once and use it anywhere."}
      </Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onHide();
          }}
          variant="outline-warning"
          disabled={inprogress}
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onYes();
          }}
          variant="warning"
        >
          {inprogress === true ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="sr-only">Creating...</span>
            </>
          ) : (
            <>Create Now</>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const getCurrentMediaSource = (props, state) => {
  let mediaSource = "";
  switch (props.sidebarSlider.sliderPanelType) {
    case "video":
      mediaSource = props.sidebarSlider.videoSource;
      break;
    case "images":
      mediaSource = props.sidebarSlider.imageSource;
      break;
    case "icons":
      mediaSource = state.selectedSource || props.sidebarSlider.iconsSource;
      break;
    case "music":
      mediaSource = props.sidebarSlider.musicSource;
      break;
    default:
      break;
  }
  return mediaSource;
};

export const TldrLicenseAgreementText = (props) => {
  return (
    <div className="thirdparty-license-agreement license-agreement-text">
      <p>
        {props.text}
        <a
          href={props.redirectTo}
          className="license-agreement"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          Read more
        </a>
      </p>
    </div>
  );
};

export const TldrAnimationPlaybackRow = ({
  callback,
  showPause,
  title,
  className,
  disabled,
}) => {
  return (
    <>
      <StyledAdvEditorToolbarRow className={className}>
        <StyledAdvEditorToolbarFormatGroup>
          <div className="title">{title}</div>
          <div className="actions mr-3">
            <TldrAnimationPlaybackAction
              action="play"
              icon="play"
              title="Play"
              callback={callback}
              disabled={disabled}
            />

            {showPause && (
              <TldrAnimationPlaybackAction
                action="pause"
                icon="pause"
                title="Pause"
                callback={callback}
              />
            )}

            <TldrAnimationPlaybackAction
              action="stop"
              icon="stop"
              title="Stop"
              callback={callback}
              disabled={disabled}
            />
          </div>
        </StyledAdvEditorToolbarFormatGroup>
      </StyledAdvEditorToolbarRow>

      {/* <StyledMotionPanelButton>Open Timeline</StyledMotionPanelButton> */}
      <hr className="tldr-hr"></hr>
    </>
  );
};

export const Duration = ({ type, seconds }) => {
  return (
    <time dateTime={`P${Math.round(seconds)}S`}>
      {type === "video_duration"
        ? formatDuration(seconds)
        : formatSelectedDuration(seconds)}
    </time>
  );
};

export const CustomStorySizeModal = (props) => {
  const {
    show,
    onHide,
    onYes,
    height,
    width,
    onWidthFocusOut,
    onHeigthFocusOut,
    onValuesInterchange,
    toggleAspectRatio,
    aspectRatioLock,
  } = props;

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <Modal.Title>Create custom Artboard</Modal.Title>
      </Modal.Header>
      <hr className="modal-hr" />

      <Modal.Body>
        Start by entering desired width and height
        <StyledGradientAngleRow className="mt-3">
          <StyledCustomStorySizeIcon>
            <FontAwesomeIcon icon="arrows-alt-h" />
          </StyledCustomStorySizeIcon>
          <EditableLabel
            text={`${width}`}
            labelClassName="customstorysizename"
            inputClassName="customstorysizeinput"
            onFocusOut={(text) => onWidthFocusOut(text)}
            showIcon={false}
            inputMaxLength={4}
            labelPlaceHolder="Width"
          />

          <StyledCustomStoryActions onClick={() => onValuesInterchange()}>
            <FontAwesomeIcon icon="exchange-alt" />
          </StyledCustomStoryActions>

          <StyledCustomStorySizeIcon>
            <FontAwesomeIcon icon="arrows-alt-v" />
          </StyledCustomStorySizeIcon>
          <EditableLabel
            text={`${height}`}
            labelClassName="customstorysizename"
            inputClassName="customstorysizeinput"
            onFocusOut={(text) => onHeigthFocusOut(text)}
            showIcon={false}
            inputMaxLength={4}
            labelPlaceHolder="Height"
          />

          <div className="m-2">px</div>

          <StyledCustomStoryActions onClick={() => toggleAspectRatio()}>
            {!aspectRatioLock ? (
              <FontAwesomeIcon icon="unlock" />
            ) : (
              <FontAwesomeIcon icon="lock" />
            )}
          </StyledCustomStoryActions>
        </StyledGradientAngleRow>
      </Modal.Body>

      <hr className="modal-hr" />
      <Modal.Footer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onHide();
          }}
          variant="outline-warning"
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onYes();
          }}
          variant="warning"
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const DraggablePreviewArtBoard = (props) => {
  const { id, page, isCurrentPage } = props;
  const pageDuration = page?.payload?.animation?.duration;
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.ARTBOARD,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.payload.id;
      const hoverIndex = id;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      props.onMoveItem(dragIndex, hoverIndex);
    },
    drop: (item) => {
      props.onDrop(item.payload.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const [, drag] = useDrag({
    item: {
      type: ItemTypes.ARTBOARD,
      payload: page,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <StyledArtBoardRearrangeContainer
      ref={ref}
      key={page.order}
      className={isCurrentPage ? "active" : ""}
    >
      <StyledArtBoardPreviewContainer>
        <StyledArtBoardPreviewTitle location="preview-container">
          <p>{page.order + 1}</p>
        </StyledArtBoardPreviewTitle>
        {pageDuration && (
          <StyledArtboardPreviewDuration>
            {dayjs.duration(pageDuration, "seconds").format("mm:ss")}
          </StyledArtboardPreviewDuration>
        )}
        <StyledArtBoardPreviewStaticCanvasWrapper>
          <ArtBoardPreviewStaticCanvas page={page} />
        </StyledArtBoardPreviewStaticCanvasWrapper>
      </StyledArtBoardPreviewContainer>
    </StyledArtBoardRearrangeContainer>
  );
};

const validationSchemaProjectName = yup.object({
  projectName: yup.string().max(50).required("Project Name cannot be empty."),
});

export const EditProjectName = ({
  props,
  handleCloseAddModal,
  signal,
  onSubmit,
}) => (
  <Formik
    enableReinitialize
    validationSchema={validationSchemaProjectName}
    initialValues={{
      projectName: props.story.payload.title,
    }}
    onSubmit={(values, { setSubmitting }) => {
      props.updateStory(
        props.story.payload.id,
        { title: values.projectName },
        signal,
        {
          ...props,
        }
      );
      setSubmitting(false);
    }}
  >
    {({ isSubmitting, isValid, values }) => (
      <Form>
        <Modal.Header>
          <Modal.Title>Rename project</Modal.Title>
        </Modal.Header>
        <hr className="modal-hr" />
        <Modal.Body>
          <div className="input-group">
            <StyledLoginFormField
              className="input-group"
              type="name"
              name="projectName"
              placeholder="Project Name"
            />
          </div>
          <ErrorMessage name="projectName" component="div" className="error" />
        </Modal.Body>
        <hr className="modal-hr" />
        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseAddModal();
            }}
            variant="outline-warning"
            disabled={isSubmitting}
            className="float-right"
          >
            Cancel
          </Button>
          <Button
            tldrbtn="primary"
            type="submit"
            disabled={values.projectName === "" || !isValid}
            className="btn btn-warning tldr-login-btn float-right"
            onClick={handleCloseAddModal}
          >
            {!isSubmitting ? (
              "Update"
            ) : (
              <Spinner
                variant="dark"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </Modal.Footer>
      </Form>
    )}
  </Formik>
);

const validationSchemaTemplateName = yup.object({
  templateName: yup.string().required("Template Name cannot be empty."),
});

export const SaveAsTemplate = ({
  props,
  handleCloseAddModal,
  signal,
  onSubmit,
}) => (
  <Formik
    enableReinitialize
    validationSchema={validationSchemaTemplateName}
    initialValues={{
      templateName: props.props.story.payload.title,
    }}
    onSubmit={(values, { setSubmitting, setErrors }) => {
      props.showToast({
        message: "Saving project as template ...",
        heading: "Info",
        type: "info",
      });
      onSubmit(
        props,
        props.props.story.payload.id,
        props.props.pagestore.pageIds[0],
        true,
        values.templateName
      );
      setSubmitting(false);
    }}
  >
    {({ isSubmitting, isValid, values }) => (
      <Form>
        <Modal.Header>
          <Modal.Title>Save as template</Modal.Title>
        </Modal.Header>
        <hr className="modal-hr" />
        <Modal.Body>
          <StyledSaveAsTemplateTextBlock>
            When you save a project file as a template, you do more than just
            save time. Anyone in your organization will be able to find and use
            it.
          </StyledSaveAsTemplateTextBlock>

          <div className="input-group">
            <StyledLoginFormField
              className="input-group"
              type="name"
              name="templateName"
              placeholder="Template Name"
            />
          </div>
          <ErrorMessage name="templateName" component="div" className="error" />
        </Modal.Body>
        <hr className="modal-hr" />
        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseAddModal();
            }}
            variant="outline-warning"
            disabled={isSubmitting}
            className="float-right"
          >
            Cancel
          </Button>
          <Button
            tldrbtn="primary"
            type="submit"
            disabled={values.templateName === "" || !isValid}
            className="btn btn-warning tldr-login-btn float-right"
            onClick={handleCloseAddModal}
          >
            {!isSubmitting ? (
              "Save as template"
            ) : (
              <Spinner
                variant="dark"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </Modal.Footer>
      </Form>
    )}
  </Formik>
);

export const TldrBadge = ({ children, badgeText = "New" }) => {
  return (
    <StyledTldrBadgeWrapper>
      <Badge className="new-feature-badge">{badgeText}</Badge>

      {children}
    </StyledTldrBadgeWrapper>
  );
};
