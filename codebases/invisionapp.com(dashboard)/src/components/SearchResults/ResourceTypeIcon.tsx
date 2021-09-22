// @ts-nocheck // TODO: need Helios to update the DocumentIcon to support size 24 to type check again
import React from "react";
import { DocumentIcon } from "@invisionapp/helios";

import { ResourceType, isOfResourceType } from "../../types/ResourceType";
const ResourceTypeIcon = ({
  resourceType,
  logoSrc,
  freehandLogoSrc,
  className,
}: {
  resourceType: string;
  logoSrc?: string;
  freehandLogoSrc?: string;
  className?: string;
}) => {
  if (!resourceType || resourceType.length === 0) {
    return null;
  }

  const iconSrc = !isOfResourceType(resourceType) ? logoSrc : undefined;

  return (
    <DocumentIcon
      className={className}
      size="24"
      documentType={
        resourceType === "presentation"
          ? "prototype"
          : (resourceType as ResourceType)
      } // see FIND-4963
      src={freehandLogoSrc || iconSrc}
      data-testid={`global-search-ui-resource-type-icon-${resourceType}`}
    />
  );
};

export default ResourceTypeIcon;
