import {SideNavigationNode, NavigationLink} from "models";
import {isDefined, isObject} from "../../../utils/typeGuards";

const createNavigationLink = (
    sideNavigationNode: unknown,
    language: Language,
    currentPath: string,
    onClick?: (url: string) => any,
): null | NavigationLink => {
    if (!isObject(sideNavigationNode)) {
        return null;
    }

    const path = sideNavigationNode.path;
    const links = Array.isArray(sideNavigationNode.children)
        ? sideNavigationNode.children
              .map((item: SideNavigationNode) => createNavigationLink(item, language, currentPath, onClick))
              .filter(isDefined)
        : [];

    const result: NavigationLink = {
        title: sideNavigationNode.title,
        isSelected: currentPath === path,
        onClick: (e: React.MouseEvent) => {
            if (onClick) {
                e.preventDefault();
                e.stopPropagation();
                onClick(path);
            }
        },
        path: path || "javascript:void(0);",
        links,
    };
    return result;
};

export default createNavigationLink;
