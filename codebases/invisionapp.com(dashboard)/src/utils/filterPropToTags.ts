import { FilterProp } from "../types/GlobalSearchUiProps";
import { SearchScope, SearchType } from "../types/SearchScope";
import { SearchTagType } from "../types/SearchTagType";

export const filtersPropsToTags = (
  filterProp: FilterProp
): Array<SearchTagType> => {
  if (!filterProp) {
    return [];
  }

  let tags = Array<SearchTagType>();
  filterProp.spaces &&
    filterProp.spaces.forEach((space, index) => {
      tags.push({
        scope: SearchScope.space,
        value: space.title,
        id: space.id,
        index: index,
      });
    });

  filterProp.projects &&
    filterProp.projects.forEach((project, index) => {
      tags.push({
        scope: SearchScope.project,
        value: project.title,
        id: project.id,
        index,
      });
    });

  filterProp.types &&
    Array.isArray(filterProp.types) &&
    filterProp.types.forEach((type, index) => {
      switch (type.toLocaleLowerCase().trim()) {
        case "spaces":
          tags.push({
            scope: SearchScope.type,
            value: SearchType.spaces,
            index: index,
          });
          break;
        case "projects":
          tags.push({
            scope: SearchScope.type,
            value: SearchType.projects,
            index: index,
          });
      }
    });

  return tags;
};
