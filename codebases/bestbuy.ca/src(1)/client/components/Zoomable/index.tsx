import * as React from "react";
import {useState, Dispatch, useEffect, useCallback} from "react";
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch";
import {Button, ZoomIn, ZoomOut} from "@bbyca/bbyca-components";
import styles from "./style.css";
import {classname, classIf} from "utils/classname";

export type ZoomableComponentEventHandler = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
) => void;

interface TransformOptionDisabled {
    disabled: boolean;
}
interface TransformWrapperSettings {
    defaultScale: number;
    defaultPositionX: number;
    defaultPositionY: number;
    scalePadding: {
        size: number;
    };
    options: {
        maxScale: number;
        centerContent: boolean;
        limitToBounds: boolean;
    };
    reset: {animationTime: number};
    pan: {
        disabled: boolean;
        padding: boolean;
        animationTime: number;
        panPaddingShiftTime: number;
    };
    doubleClick: TransformOptionDisabled;
    wheel: TransformOptionDisabled;
    onPinchingStop: ({scale}: {scale: number}) => void;
    onZoomChange: ({scale}: {scale: number}) => void;
    zoomIn: {
        disabled: boolean;
        step: number;
        animation: boolean;
    };
    zoomOut: {
        disabled: boolean;
        step: number;
        animation: boolean;
    };
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3; // 1500 / 500
const DOUBLE_TAP_LISTENER_INTERVAL = 300; // interval for second tap to register as double tap
const ANIMATION_THREAD_DELAY = 300;
/**
 * Currently there is an issue that image zoom doesn't work with onImageZoom callback
 * when animation time is greater than zero.
 */
const ANIMATION_TIME = 0; // zoom in/out speed
let CENTER_OFFSET_X: number;
let CENTER_OFFSET_Y: number;

const initialStaticSettings: Omit<TransformWrapperSettings, "onPinchingStop" | "onZoomChange"> = {
    defaultScale: 1,
    defaultPositionX: 0,
    defaultPositionY: 0,
    scalePadding: {size: 0},
    options: {
        maxScale: MAX_ZOOM,
        centerContent: true,
        limitToBounds: true,
    },
    reset: {animationTime: ANIMATION_TIME},
    wheel: {disabled: true},
    pan: {
        padding: false,
        animationTime: 0,
        panPaddingShiftTime: 0,
        disabled: true,
    },
    doubleClick: {disabled: true},
    zoomIn: {
        disabled: false,
        step: 50,
        animation: false,
    },
    zoomOut: {
        disabled: false,
        step: 50,
        animation: false,
    },
};

interface TransformWrapperCallbacks {
    setTransform?: (
        positionX: number,
        positionY: number,
        scale: number,
        animationTime?: number,
        animationType?: string,
    ) => void;
    resetTransform?: () => void;
    zoomIn?: ZoomableComponentEventHandler;
    zoomOut?: ZoomableComponentEventHandler;
    scale?: number;
}

export interface ZoomableProps {
    setIsDraggable?: Dispatch<boolean>;
    children: React.ReactChildren | JSX.Element;
    resetZoomCallback?: (resetTransform: () => void, zoomableId?: number) => void;
    onImageZoom?: () => void;
}

// keep runtime instances of Zoomable components because react-slick-slider creates
// cloned shadow elements for lazy-loading purposes
let instanceIds = 0;
export const generateZoomableId = (initialValue?: number) =>
    !!initialValue ? (instanceIds = initialValue) : ++instanceIds;

export const Zoomable: React.FC<ZoomableProps> = ({children, resetZoomCallback, setIsDraggable, onImageZoom}) => {
    let doubleTapped: boolean = false;
    let internalSetTransform: TransformWrapperCallbacks["setTransform"];
    let resetTransformCallback: TransformWrapperCallbacks["resetTransform"];
    const [pannable, setPannable] = useState<TransformOptionDisabled>({disabled: true});
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [instanceId, setInstanceId] = useState<number>(0);
    const [hasId, setHasId] = useState<boolean>(false);

    const zoomableRef = useCallback(
        (node) => {
            if (!!node) {
                if (!!node.getAttribute && typeof resetZoomCallback === "function") {
                    resetZoomCallback(zoomOutEffects, instanceId);
                }

                setTimeout(() => {
                    const transformNode = node.querySelector(".react-transform-component"); // center to the clipping window
                    const {width, height} = transformNode.getBoundingClientRect();
                    CENTER_OFFSET_X = width * -1; // offset the transformed rect to center the image
                    CENTER_OFFSET_Y = height * -1;
                }, ANIMATION_THREAD_DELAY);
            }
        },
        [instanceId],
    );

    useEffect(() => {
        if (!hasId) {
            setInstanceId(generateZoomableId());
        }
        setHasId(true);
    }, [hasId]);

    const shouldPan = (scale: number) => {
        if (scale > MIN_ZOOM) {
            setPannable({disabled: false});
            setIsZoomed(true);
            if (setIsDraggable && typeof setIsDraggable === "function") {
                setIsDraggable(false);
            }
        } else {
            setPannable({disabled: true});
            setIsZoomed(false);
            if (setIsDraggable && typeof setIsDraggable === "function") {
                setIsDraggable(true);
            }
        }
    };

    const handleZoomChange = ({scale}: {scale: number}) => {
        shouldPan(scale);
    };

    const initialSettings: TransformWrapperSettings = Object.assign(initialStaticSettings, {
        pan: {...pannable},
        onPinchingStop: handleZoomChange,
        onZoomChange: handleZoomChange,
    });

    const disablePannableAndSetZoom = (zoom: boolean) => {
        setTimeout(() => {
            setPannable({disabled: !zoom});
            setIsZoomed(zoom);
            if (setIsDraggable && typeof setIsDraggable === "function") {
                setIsDraggable(!zoom);
            }
        }, ANIMATION_THREAD_DELAY);
    };

    const zoomInEffects = () => {
        if (typeof internalSetTransform === "function") {
            internalSetTransform(CENTER_OFFSET_X, CENTER_OFFSET_Y, MAX_ZOOM, ANIMATION_TIME);
        }
        disablePannableAndSetZoom(true);
        if (typeof onImageZoom === "function") {
            onImageZoom();
        }
    };

    const zoomOutEffects = () => {
        if (resetTransformCallback && typeof resetTransformCallback === "function") {
            resetTransformCallback();
        }
        disablePannableAndSetZoom(false);
    };

    const toggleZoom = () => {
        if (isZoomed) {
            setTimeout(() => {
                zoomOutEffects();
            }, ANIMATION_THREAD_DELAY);
        } else {
            zoomInEffects();
        }
    };

    const handleDoubleTapToToggleZoom = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (e) {
            e.preventDefault();
        }
        setTimeout(() => {
            doubleTapped = false;
        }, DOUBLE_TAP_LISTENER_INTERVAL);

        if (!doubleTapped) {
            doubleTapped = true;
        } else {
            toggleZoom();
        }
    };

    return (
        <div
            className={`${classname(styles.zoomableContainer)} ${classIf(
                styles.cursorGrab,
                isZoomed,
            )} x-zoomable-container`}
            data-zoomableid={instanceId}
            ref={zoomableRef}>
            <section className={classname(["x-zoom-buttons-container", styles.zoomButtonsContainer])}>
                <Button
                    size="regular"
                    onClick={zoomInEffects}
                    className={classname(styles.zoomButton)}
                    data-automation="zoom-in-button">
                    <ZoomIn color={classIf("darkGrey", isZoomed, "blue")} />
                </Button>
                <Button
                    size="regular"
                    onClick={zoomOutEffects}
                    className={classname(styles.zoomButton)}
                    data-automation="zoom-out-button">
                    <ZoomOut color={classIf("darkGrey", !isZoomed, "blue")} />
                </Button>
            </section>
            <div
                data-automation="zommable-wrapper-container"
                onTouchStart={handleDoubleTapToToggleZoom}
                onDoubleClick={toggleZoom}>
                <TransformWrapper {...initialSettings}>
                    {({resetTransform, setTransform}: TransformWrapperCallbacks) => {
                        internalSetTransform = setTransform;
                        resetTransformCallback = resetTransform;

                        return <TransformComponent>{children}</TransformComponent>;
                    }}
                </TransformWrapper>
            </div>
        </div>
    );
};

Zoomable.displayName = "Zoomable";

export default Zoomable;
