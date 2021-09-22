import { observer } from 'mobx-react-lite';
import { beginLightning, endLightning, store } from 'owa-lightning-core-v2';
import React from 'react';
import { shouldShowLightningItem } from '../utils/shouldShowLightningItem';

/**
 * Lightning properties
 */
export interface LightningProps {
    lid: string;
    when: (lightup: () => void) => void;
    series?: string[];

    /**
     * By default, lighted will be called whenever the component unmounts. If
     * that's not desired for your scenario, then you can specify this prop
     * and pass "false".
     */
    disposeOnUnmount?: boolean;
}

/**
 * React decorator to enhance a class component with Lightning functionality
 */
export function lightable<P extends object, TRef = {}>(
    InnerComponent: React.ComponentType<P>,
    forwardRef: true
): React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P & LightningProps> & React.RefAttributes<TRef>
>;
export function lightable<P extends object>(
    InnerComponent: React.ComponentType<P>
): React.ComponentType<P & LightningProps>;
export function lightable<P extends object, TRef = {}>(
    InnerComponent: React.ComponentType<P>,
    forwardRef?: true
) {
    const wrappedComponent = (props: P & LightningProps, ref: React.Ref<TRef>) => (
        <Lightable {...props}>
            <InnerComponent {...props} />
        </Lightable>
    );
    wrappedComponent.displayName = InnerComponent.displayName;

    if (forwardRef) {
        return React.forwardRef(wrappedComponent);
    } else {
        return wrappedComponent;
    }
}

/**
 * React HOC to enhance a function component with Lightning functionality
 */
export const Lightable = observer(function Lightable(
    props: LightningProps & { children?: React.ReactNode }
) {
    const { lid, when, series, children, disposeOnUnmount = true } = props;

    React.useEffect(() => {
        beginLightning(lid, when, series);

        return () => {
            if (disposeOnUnmount) {
                endLightning.importAndExecute(lid);
            }
        };
    }, []);

    return children && shouldShowLightningItem(lid) ? <>{children}</> : null;
});

export function isLightningItemUnseen(lid: string): boolean {
    return store.unseenItems?.has(lid);
}
