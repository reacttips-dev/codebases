import * as React from 'react';

export const WIDE_CONTENT_HOST_CLASS_NAME = 'wide-content-host';

export interface WideContentHostProps {
    children?: React.ReactNode;
}

export default React.forwardRef(function WideContentHost(
    { children }: WideContentHostProps,
    ref: React.Ref<HTMLDivElement>
) {
    return (
        <div className={WIDE_CONTENT_HOST_CLASS_NAME} ref={ref}>
            {children}
        </div>
    );
    // There is a bug in the React types, whereby the `children` property is deleted by React.forwardRef
}) as React.FunctionComponent<WideContentHostProps & React.RefAttributes<HTMLDivElement>>;
