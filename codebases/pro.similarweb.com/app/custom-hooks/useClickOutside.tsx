import React from "react";

/**
 * useClickOutside custom hook
 * This hook registers mouseDown capture and mouseUp event and returns onMouseDownCapture and onMouseDown handlers
 * to be used in the component. Or, you may use ClickOutsideWrapper on a component.
 *
 * Guideline: By default, click down+up or down only or up only in the popup element, will prevent from the popup
 * to be closed.
 *
 *   1. mouseDown(Capture) [document] - true (init)
 *   2. mouseDown(Capture) [wrapper] - false
 *   3. mouseup [wrapper] - false
 *   4. mouseup [document] - no change, if outside - invoke callback
 *
 * @param callback - the callback to call when clicked outside
 * @param checkIsClickOutside - function that determines whether the event is inside/outside of the element.
 */

type ICheckIsOutside = (isOutside: boolean, prevState: boolean, evt: MouseEvent) => boolean;

export const checkOutsideMechanism: { [key: string]: ICheckIsOutside } = {
    // outside only if both down & up are outside
    fullOutside: (isOutside) => isOutside,

    // outside if any down or up is outside
    partialOutside: ((): ICheckIsOutside => {
        let countInside;
        return (isOutside, prevState) => {
            if (prevState === undefined) {
                countInside = 0;
            } else if (!isOutside) {
                countInside += 1;
            }
            return countInside < 2;
        };
    })(),
};

export const useClickOutside = (
    callback: () => void,
    checkIsOutside: ICheckIsOutside = checkOutsideMechanism.fullOutside,
): { onMouseDownCapture: React.MouseEventHandler; onMouseUp: React.MouseEventHandler } => {
    const isOutsideRef = React.useRef<boolean>(undefined);

    React.useEffect(() => {
        const handleDocumentMouseDownCapture = (evt) => {
            isOutsideRef.current = checkIsOutside(true, isOutsideRef.current, evt); // init flag
        };
        const handleDocumentMouseUp = () => {
            if (isOutsideRef.current) {
                callback();
            }
            isOutsideRef.current = undefined;
        };

        document.addEventListener("mousedown", handleDocumentMouseDownCapture, { capture: true });
        document.addEventListener("mouseup", handleDocumentMouseUp, { capture: true });
        return () => {
            document.removeEventListener("mousedown", handleDocumentMouseDownCapture, {
                capture: true,
            });
            document.removeEventListener("mouseup", handleDocumentMouseUp, { capture: true });
        };
    }, [isOutsideRef, callback]);

    const onMouseDownCapture = React.useCallback((evt) => {
        isOutsideRef.current = checkIsOutside(false, isOutsideRef.current, evt);
    }, []);

    const onMouseUp = React.useCallback((evt) => {
        isOutsideRef.current = checkIsOutside(false, isOutsideRef.current, evt);
    }, []);

    return { onMouseDownCapture, onMouseUp };
};

export const ClickOutsideWrapper = ({
    children,
    onClickOutside,
    noWrap = false,
    checkIsOutside = undefined as ICheckIsOutside,
}) => {
    const { onMouseDownCapture, onMouseUp } = useClickOutside(onClickOutside, checkIsOutside);

    if (noWrap) {
        const {
            onMouseDownCapture: origOnMouseDownCapture,
            onMouseUp: origOnMouseUp,
        } = React.Children.only(children).props;
        const onMouseDownCaptureWrapped = React.useCallback(
            (evt, ...restArgs) => {
                onMouseDownCapture(evt);
                if (origOnMouseDownCapture) {
                    origOnMouseDownCapture(evt, ...restArgs);
                }
            },
            [onMouseDownCapture, origOnMouseDownCapture],
        );
        const onMouseUpWrapped = React.useCallback(
            (evt, ...restArgs) => {
                if (origOnMouseUp) {
                    origOnMouseUp(evt, ...restArgs);
                }
                onMouseUp(evt);
            },
            [onMouseUp, origOnMouseUp],
        );
        return React.cloneElement(React.Children.only(children), {
            onMouseDownCapture: onMouseDownCaptureWrapped,
            onMouseUp: onMouseUpWrapped,
        });
    }

    return (
        <span onMouseDownCapture={onMouseDownCapture} onMouseUp={onMouseUp}>
            {children}
        </span>
    );
};
