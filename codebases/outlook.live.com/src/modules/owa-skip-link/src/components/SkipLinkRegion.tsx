import * as React from 'react';
import { format } from 'owa-localize';

const ariaLabelStringTemplate = '{0}, {1}'; // {0} is the new region name, {1} is the existing aria-label on the div

export interface SkipLinkRegionProps extends React.HTMLAttributes<HTMLDivElement> {
    skipLinkName: string;
    role: 'navigation' | 'main' | 'complementary';
    children?: React.ReactNode;
    regionName?: string;
}

export const SkipLinkRegion = React.forwardRef(function SkipLinkRegion(
    { skipLinkName, children, regionName, ...divProps }: SkipLinkRegionProps,
    ref: React.Ref<HTMLDivElement>
): JSX.Element {
    let ariaLabel = divProps['aria-label'];
    ariaLabel = !!regionName
        ? !!ariaLabel
            ? format(ariaLabelStringTemplate, regionName, ariaLabel)
            : regionName
        : ariaLabel;

    return (
        <div
            tabIndex={-1}
            {...divProps}
            aria-label={ariaLabel}
            data-skip-link-name={skipLinkName}
            ref={ref}>
            {children}
        </div>
    );
});
