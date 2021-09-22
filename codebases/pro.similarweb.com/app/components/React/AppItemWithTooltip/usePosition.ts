import React, { useState, useEffect, useCallback } from "react";

const NUMER_OF_ELEMENTS_TO_SCROLL = 3;
const COMPENSATE_FOR_DRAWING_OFFSET = 1;

const getPrevElement = (list) => {
    const sibling = list[0].previousElementSibling;

    if (sibling instanceof HTMLElement) {
        return sibling;
    }

    return null;
};

const getNextElement = (list) => {
    const sibling = list[list.length - 1].nextElementSibling;

    if (sibling instanceof HTMLElement) {
        return sibling;
    }

    return null;
};

export function usePosition(ref, numOfItems) {
    const [prevElement, setPrevElement] = useState(null);
    const [nextElement, setNextElement] = useState(null);
    useEffect(() => {
        const element = ref.current;

        const update = () => {
            const rect = element.getBoundingClientRect();
            const visibleElements = Array.from(element.children).filter((child: HTMLElement) => {
                const childRect = child.getBoundingClientRect();
                return (
                    childRect.left >= rect.left &&
                    childRect.right <= rect.right + COMPENSATE_FOR_DRAWING_OFFSET
                );
            });
            if (visibleElements.length > 0) {
                setPrevElement(getPrevElement(visibleElements));
                setNextElement(getNextElement(visibleElements));
            }
        };

        update();
        element.addEventListener("scroll", update, { passive: true });
        return () => {
            element.removeEventListener("scroll", update, { passive: true });
        };
    }, [ref, numOfItems]);

    const scrollToElement = useCallback(
        (element, direction) => {
            const currentNode = ref.current;
            if (!currentNode || !element) return;

            let newScrollPosition;
            if (direction === "left") {
                newScrollPosition =
                    currentNode.scrollLeft -
                    element.getBoundingClientRect().width * NUMER_OF_ELEMENTS_TO_SCROLL;
            } else {
                newScrollPosition =
                    currentNode.scrollLeft +
                    element.getBoundingClientRect().width * NUMER_OF_ELEMENTS_TO_SCROLL;
            }

            currentNode.scroll({
                left: newScrollPosition,
                behavior: "smooth",
            });
        },
        [ref, numOfItems],
    );

    const scrollRight = useCallback(() => scrollToElement(nextElement, "right"), [
        scrollToElement,
        nextElement,
    ]);

    const scrollLeft = useCallback(() => scrollToElement(prevElement, "left"), [
        scrollToElement,
        prevElement,
    ]);

    return {
        hasItemsOnLeft: prevElement !== null,
        hasItemsOnRight: nextElement !== null,
        scrollRight,
        scrollLeft,
    };
}
