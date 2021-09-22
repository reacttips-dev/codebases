import { FC, useEffect, useState } from "react";

export const responsiveRender = (
    clientWidthThreshold: number,
    smallMonitorComponent: FC<any>,
    bigMonitorComponent: FC<any>,
): FC<any> => {
    const [clientWidth, setClientWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
        const updateWidth = () => {
            setClientWidth(window.innerWidth);
        };
        window.addEventListener("resize", updateWidth, { capture: true });
        return () => window.removeEventListener("resize", updateWidth, { capture: true });
    }, []);
    return clientWidth > clientWidthThreshold ? bigMonitorComponent : smallMonitorComponent;
};
