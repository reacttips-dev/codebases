import { ComponentType } from "react";

export const getDisplayName = (Component: ComponentType) =>
    Component.displayName || Component.name || "Component";
