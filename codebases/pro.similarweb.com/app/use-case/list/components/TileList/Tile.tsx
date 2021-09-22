import React, { FC, ReactElement, useCallback, useEffect, useRef } from "react";
import * as SC from "use-case/list/components/StyledComponents";

interface ITileProps {
    title: string;
    description: string;
    href: string;
    id: string;
    children: ReactElement<"img">;
    onClick: (id: string, href: string) => void;
}

export const Tile: FC<ITileProps> = ({ id, title, description, href, children, onClick }) => {
    const handleClick = useCallback(() => onClick(id, href), [onClick, href]);

    // HACK: preventing like that because .preventDefault() on synthetic events doesn'twork
    // reliably for anchors in pro. The reason is that the angular app has some event listeners for
    // anchors and it messes with react's event handlers. That way we call preventDefault in advance.
    const linkRef = useRef<HTMLAnchorElement | null>(null);
    useEffect(() => {
        const preventDefault = (e: MouseEvent) => e.preventDefault();
        linkRef.current?.addEventListener("click", preventDefault, { capture: true });
        return () =>
            linkRef.current?.removeEventListener("click", preventDefault, { capture: true });
    }, []);

    return (
        <SC.Tile>
            <SC.TileIconSpacer>
                <SC.TileIconHolder>{children}</SC.TileIconHolder>
            </SC.TileIconSpacer>
            <SC.TileTitle>{title}</SC.TileTitle>
            <SC.TileDescription>{description}</SC.TileDescription>
            <SC.LinkStretched ref={linkRef} onClick={handleClick} href={href}>
                {title}
            </SC.LinkStretched>
        </SC.Tile>
    );
};
