import * as React from 'react';
import { styled, IPropsWithStyles } from '@fluentui/utilities';
import * as classes from './svgIcon.scss';

interface SvgIconCreateFnParams {
    Svg: (props: React.SVGAttributes<unknown>) => JSX.Element;
    displayName: string;
}

export const createSvgIcon = ({ Svg, displayName }: SvgIconCreateFnParams) => {
    const Component = styled(
        ({ styles }: IPropsWithStyles<{}, {}>) => {
            const { root: rootStyle, svg: svgStyle } =
                typeof styles === 'function' ? styles({}) : styles;
            return (
                <span
                    role="presentation"
                    aria-hidden={true}
                    style={rootStyle}
                    className={classes.root}>
                    <Svg className={classes.svg} style={svgStyle} />
                </span>
            );
        },
        {},
        undefined,
        { scope: 'OwaSvgIcon' }
    );

    Component.displayName = displayName;

    return Component;
};
